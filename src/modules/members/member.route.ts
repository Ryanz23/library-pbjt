import { Elysia, t } from "elysia";
import { MemberService } from "./member.service";
import { CreateMemberDTO } from "./member.model";

export const memberRoute = new Elysia({ prefix: "/members" })
  // GET /members
  .get("/", async () => {
    const members = await MemberService.getAllMembers();
    return Response.json(members);
  })

  // GET /members/:id
  .get("/:id", async ({ params }) => {
    const member = await MemberService.getMemberById(params.id);
    return Response.json(member);
  }, {
    params: t.Object({
      id: t.String({ minLength: 1 })
    })
  })

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
        semester: t.Number({ minimum: 1 })
      })
    }
  )

  .put(
    "/:id",
    async ({ params, body }) => {
        return Response.json(
            await MemberService.updateMember(params.id as string, body as Partial<CreateMemberDTO>)
        );
    }
  )

  .delete(
    "/:id",
    async ({ params }) => {
        return Response.json(
            await MemberService.deleteMember(params.id as string)
        );
    }
  )