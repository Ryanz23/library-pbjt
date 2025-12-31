import { Elysia, t } from "elysia";
import { LoanService } from "./loan.service";
import { CreateLoanDTO } from "./loan.model";

const CreateLoanBody = t.Object({
  book_id: t.String({ minLength: 1, description: "Kode buku custom (misal B001)" }),
  member_id: t.String({ minLength: 1, description: "Kode member custom (misal 23190056)" }),
  quantity: t.Number({ minimum: 1, description: "Jumlah buku yang dipinjam" }),
  loan_date: t.Optional(t.String({ format: "date" })),
});

const UpdateQuantityBody = t.Object({
  quantity: t.Number({ minimum: 1 }),
});

export const loanRoute = new Elysia({ prefix: "/loans" })
  // GET /loans - Ambil semua pinjaman (dengan kode custom + nama + judul)
  .get("/", async () => {
    const loans = await LoanService.getAllLoans();
    return Response.json(loans);
  }, {
    detail: {
      description: "Daftar semua peminjaman",
      tags: ["Loans"]
    }
  })

  // GET /loans/:id - Ambil detail pinjaman berdasarkan ID
  .get("/:id", async ({ params }) => {
    const loan = await LoanService.getLoanById(params.id);
    return Response.json(loan);
  })

  // POST /loans - Pinjam buku baru
  .post("/", async ({ body }) => {
    const result = await LoanService.borrowBook(body as CreateLoanDTO);
    return result;
  }, {
    body: CreateLoanBody,
    detail: {
      description: "Pinjam buku baru",
      tags: ["Loans"]
    },
    response: t.Object({
      message: t.String(),
      loan_id: t.Optional(t.String())
    })
  })

  // PATCH /loans/:id/return - Kembalikan buku
  .patch("/:id/return", async ({ params }) => {
    const result = await LoanService.returnBook(params.id);
    return result;
  }, {
    params: t.Object({
      id: t.String({ minLength: 1 })
    }),
    detail: {
      description: "Kembalikan buku (isi return_date + tambah stock)",
      tags: ["Loans"]
    },
    response: t.Object({
      message: t.String()
    })
  })

  // PUT /loans/:id - Update jumlah pinjaman aktif
  .put("/:id", async ({ params, body }) => {
    const result = await LoanService.updateLoanQuantity(params.id, body.quantity);
    return result;
  }, {
    params: t.Object({
      id: t.String({ minLength: 1 })
    }),
    body: UpdateQuantityBody,
    detail: {
      description: "Update jumlah buku yang dipinjam (untuk pinjaman aktif)",
      tags: ["Loans"]
    },
    response: t.Object({
      message: t.String()
    })
  })

  // DELETE /loans/:id - Hapus pinjaman (kembalikan stock kalau belum return)
  .delete("/:id", async ({ params }) => {
    const result = await LoanService.deleteLoan(params.id);
    return result;
  }, {
    params: t.Object({
      id: t.String({ minLength: 1 })
    }),
    detail: {
      description: "Hapus data pinjaman (stock dikembalikan kalau belum return)",
      tags: ["Loans"]
    },
    response: t.Object({
      message: t.String()
    })
  });