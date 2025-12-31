import { db } from "../../config/db";
import bcrypt from "bcrypt";
import { LoginAdminDTO, AdminResponse } from "./admin.model";

export const AdminService = {
    async getAdminById(id: string): Promise<AdminResponse | null> {
      const result = await db<AdminResponse[]>
      `
       SELECT id, username, created_at
       FROM admins
       WHERE id = ${id}
      `;
      return result[0] || null;
    },

    async login(data: LoginAdminDTO): Promise<AdminResponse | null> {
        const result = await db<(Pick<AdminResponse, "id" | "username" | "created_at"> & {password: string})[]>
        `
          SELECT id, username, password, created_at
          FROM admins
          WHERE username = ${data.username}
        `;

        const admin = result[0];
        if (!admin) return null;

        const isValid = await bcrypt.compare(data.password, admin.password);
        if (!isValid) return null;

        const { password: _, ...safeAdmin } = admin;
        return safeAdmin;
    },

    async register(data: { username: string; password: string}): Promise<AdminResponse | null> {
        const hashedPassword = await this.hashPassword(data.password);

        const result = await db<AdminResponse[]>`
          INSERT INTO admins (username, password)
          VALUES (
            ${data.username},
            ${hashedPassword}
          )
          RETURNING id, username, created_at
        `;
        return result[0] || null;
    },

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}