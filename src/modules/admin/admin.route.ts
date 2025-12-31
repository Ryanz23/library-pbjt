import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { AdminService } from "./admin.service";
import { 
    AdminJwtPayload, 
    AdminResponse, 
    LoginAdminDTO,
    CreateAdminDTO 
} from "./admin.model";
import { env } from "../../config/env";

export const adminRoute = new Elysia({ prefix: "/admin" })
  .use(
    jwt({
      name: "jwt",
      secret: env.jwt.secret as string,
    })
  )

  // GET /admin/me - Ambil data admin yang sedang login (protected)
  .get(
    "/me",
    async ({ jwt, set, headers }) => {
      const authorization = headers.authorization;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        return { message: "Token tidak ditemukan" };
      }

      const token = authorization.split(" ")[1];

      const payload = await jwt.verify(token);

      if (!payload) {
        set.status = 401;
        return { message: "Token tidak valid atau kadaluarsa" };
      }

      // Ambil data admin dari database (opsional, kalau mau data fresh)
      const admin = await AdminService.getAdminById(payload.sub as string);

      if (!admin) {
        set.status = 404;
        return { message: "Admin tidak ditemukan" };
      }

      return {
        message: "Data admin berhasil diambil",
        admin: {
          id: admin.id,
          username: admin.username,
          created_at: admin.created_at,
        } as AdminResponse,
      };
    },
    {
      detail: {
        tags: ["Admin"],
        summary: "Profil Admin",
        description: "Mengambil data admin yang sedang login menggunakan JWT token",
        security: [{ Bearer: [] }], // untuk Swagger/OpenAPI
      },
    }
  )

  // POST admin register
  .post(
    "/register",
    async ({ body }) => {
        const adminData = await AdminService.register(body as CreateAdminDTO);

        if (!adminData) {
            return Response.json(
                { message: "Username sudah digunakan" },
                { status: 409 }
            );
        }

        return Response.json(
            {
                message: "Registrasi berhasil",
                admin: {
                    id: adminData.id,
                    username: adminData.username,
                    created_at: adminData.created_at
                },
            },
            { status: 201 }
        )
    }
  )

  // POST admin login
  .post(
    "/login",
    async ({ body, jwt }) => {
      const admin = await AdminService.login(body as LoginAdminDTO);

      if (!admin) {
        return Response.json(
          { message: "Username atau password salah" },
          { status: 401 } // Unauthorized
        );
      }

      const token = await jwt.sign({
        sub: admin.id,
        username: admin.username,
        role: "admin" as const,
      } satisfies AdminJwtPayload);

      return Response.json(
        {
          message: "Login berhasil",
          token,
          admin: {
            id: admin.id,
            username: admin.username,
          } as AdminResponse,
        },
        { status: 200 } // OK
      );
    },
    {
      body: t.Object({
        username: t.String({
          minLength: 3,
          error: "Username minimal 3 karakter",
        }),
        password: t.String({
          minLength: 6,
          error: "Password minimal 6 karakter",
        }),
      }),
      detail: {
        tags: ["Admin"],
        summary: "Login Admin",
        description: "Autentikasi admin dan mengembalikan JWT token",
      },
    }
  );