import { Elysia, t } from "elysia";
import { MemberService } from "./member.service";
import { CreateMemberDTO } from "./member.model";

export const memberRoute = new Elysia({ prefix: "/members" })
  // GET /members
  .get(
    "/",
    async () => {
      const members = await MemberService.getAllMembers();
      return Response.json(members);
    },
    {
      detail: {
        tags: ["Member"],
        summary: "Get All Members",
        description: "Mengambil semua data member yang tersedia di sistem",
      },
    },
  )

  // GET /members/:id
  .get(
    "/:id",
    async ({ params }) => {
      const member = await MemberService.getMemberById(params.id);
      return Response.json(member);
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ["Member"],
        summary: "Get Member by ID",
        description: "Mengambil detail member berdasarkan ID",
      },
    },
  )

  // POST /members
  .post(
    "/",
    async ({ body }) => {
      return await MemberService.addMember(body as CreateMemberDTO);
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        study_program: t.String(),
        semester: t.Number({ minimum: 1, maximum: 14 }),
      }),
      detail: {
        tags: ["Member"],
        summary: "Register New Member",
        description: "Menambahkan data member baru ke dalam sistem",
      },
    },
  )

  // PUT /members/:id
  .put(
    "/:id",
    async ({ params, body }) => {
      return Response.json(
        await MemberService.updateMember(
          params.id as string,
          body as Partial<CreateMemberDTO>,
        ),
      );
    },
    {
      body: t.Object({
        id: t.String(),
        name: t.String(),
        study_program: t.String(),
        semester: t.Number({ minimum: 1, maximum: 14 }),
      }),
      detail: {
        tags: ["Member"],
        summary: "Update Member by ID",
        description: "Memperbarui data member berdasarkan ID",
      },
    },
  )

  // DELETE /members/:id
  .delete(
    "/:id",
    async ({ params }) => {
      return Response.json(
        await MemberService.deleteMember(params.id as string),
      );
    },
    {
      detail: {
        tags: ["Member"],
        summary: "Delete Member by ID",
        description: "Menghapus data member berdasarkan ID",
      },
    },
  );
