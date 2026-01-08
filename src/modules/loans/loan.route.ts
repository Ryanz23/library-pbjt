import { Elysia, t } from "elysia";
import { LoanService } from "./loan.service";
import { CreateLoanDTO } from "./loan.model";

const CreateLoanBody = t.Object({
  book_id: t.String({
    minLength: 1,
  }),
  member_id: t.String({
    minLength: 1,
  }),
  quantity: t.Number({ minimum: 1 }),
  loan_date: t.Optional(t.String({ format: "date" })),
});

const UpdateLoanBody = t.Object({
  book_id: t.Optional(
    t.String({
      minLength: 1,
    }),
  ),
  member_id: t.Optional(
    t.String({
      minLength: 1,
    }),
  ),
  quantity: t.Optional(t.Number({ minimum: 1 })),
  loan_date: t.Optional(t.String({ format: "date" })),
});

export const loanRoute = new Elysia({ prefix: "/loans" })
  // GET /loans
  .get(
    "/",
    async () => {
      const loans = await LoanService.getAllLoans();
      return Response.json(loans);
    },
    {
      detail: {
        tags: ["Loans"],
        summary: "Get All Loans",
        description:
          "Mengambil seluruh data peminjaman buku beserta informasi buku dan member",
      },
    },
  )

  // GET /loans/:id
  .get(
    "/:id",
    async ({ params }) => {
      const loan = await LoanService.getLoanById(params.id);
      return Response.json(loan);
    },
    {
      detail: {
        tags: ["Loans"],
        summary: "Get Loan By ID",
        description: "Mengambil detail data peminjaman berdasarkan ID",
      },
    },
  )

  // POST /loans
  .post(
    "/",
    async ({ body }) => {
      const loan = await LoanService.borrowBook(body as CreateLoanDTO);
      return loan;
    },
    {
      body: CreateLoanBody,
      response: t.Object({
        message: t.String(),
        loan_id: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Loans"],
        summary: "Create New Loan",
        description:
          "Membuat data peminjaman buku baru dan mengurangi stok buku",
      },
    },
  )

  // PATCH /loans/:id/return
  .patch(
    "/:id/return",
    async ({ params }) => {
      const loan = await LoanService.returnBook(params.id);
      return loan;
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      response: t.Object({
        message: t.String(),
      }),
      detail: {
        tags: ["Loans"],
        summary: "Loan Book Returns",
        description:
          "Mengembalikan buku, mengisi tanggal pengembalian, dan menambah stok buku",
      },
    },
  )

  // PUT /loans/:id
  .put(
    "/:id",
    async ({ params, body }) => {
      return await LoanService.updateLoanBody(params.id, body);
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      body: UpdateLoanBody,
      response: t.Object({
        message: t.String(),
      }),
      detail: {
        tags: ["Loans"],
        summary: "Update Loan",
        description: "Memperbarui data peminjaman yang masih aktif",
      },
    },
  )

  // DELETE /loans/:id
  .delete(
    "/:id",
    async ({ params }) => {
      const loan = await LoanService.deleteLoan(params.id);
      return loan;
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      response: t.Object({
        message: t.String(),
      }),
      detail: {
        tags: ["Loans"],
        summary: "Delete Loan",
        description:
          "Menghapus data peminjaman dan mengembalikan stok jika buku belum dikembalikan",
      },
    },
  );
