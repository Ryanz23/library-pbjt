import { db } from "../../config/db";
import bcrypt from "bcrypt";
import { LoginAdminDTO, AdminResponse } from "./admin.model";
import { AppError } from "../../handler/error";

export const AdminService = {
  async getAdminById(id: string): Promise<AdminResponse> {
    const result = await db<AdminResponse[]>`
       SELECT id, username, created_at
       FROM admins
       WHERE id = ${id}
      `;
    const admin = result[0];
    if (!admin) {
      throw new AppError("Admin tidak ditemukan", 404);
    }
    return admin;
  },

  async login(data: LoginAdminDTO): Promise<AdminResponse> {
    const result = await db<
      (Pick<AdminResponse, "id" | "username" | "created_at"> & {
        password: string;
      })[]
    >`
          SELECT id, username, password, created_at
          FROM admins
          WHERE username = ${data.username}
        `;

    const admin = result[0];
    if (!admin) {
      throw new AppError("Username atau password salah", 401);
    }

    const isValid = await bcrypt.compare(data.password, admin.password);
    if (!isValid) {
      throw new AppError("Username atau password salah", 401);
    }

    const { password: _, ...safeAdmin } = admin;
    return safeAdmin;
  },

  async register(data: {
    username: string;
    password: string;
  }): Promise<AdminResponse> {
    const exists = await db<{ id: string }[]>`
      SELECT id FROM admins WHERE username = ${data.username}
    `;

    if (exists.length > 0) {
      throw new AppError("Username sudah digunakan", 409);
    }

    const hashedPassword = await this.hashPassword(data.password);

    const result = await db<AdminResponse[]>`
          INSERT INTO admins (username, password)
          VALUES (
            ${data.username},
            ${hashedPassword}
          )
          RETURNING id, username, created_at
        `;
    return result[0];
  },

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  },
};
