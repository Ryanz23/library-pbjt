import { db } from "../../config/db";
import { CreateLoanDTO } from "./loan.model";
import { LoanRepository } from "./loan.repository";

export const LoanService = {
    async getAllLoans() {
        return await LoanRepository.findAll();
    },

    async getLoanById(id: string) {
      const loan = await LoanRepository.findById(id);
      return loan;
    },

    async borrowBook(data: CreateLoanDTO) {
        if (data.quantity <= 0) {
            throw new Error("Jumlah pinjaman tidak valid");
        }

        let loan_id: string = "";

        await db.begin(async (trx) => {
            // Kurangi stock buku
            loan_id = await LoanRepository.create(trx, data);
        });

        return {
            message: "Peminjaman buku berhasil",
            loan_id: loan_id
        };
    },

    async returnBook(loan_id: string) {
        await db.begin(async (trx) => {
          await LoanRepository.returnLoan(trx, loan_id);
        });
    
        return {
          message: "Buku berhasil dikembalikan dan stock telah ditambahkan kembali"
        };
      },

      async updateLoanQuantity(loan_id: string, newQuantity: number) {
        if (newQuantity <= 0) {
          throw new Error("Jumlah pinjaman tidak valid");
        }
    
        const loan = await LoanRepository.findById(loan_id);
        if (!loan) throw new Error("Data pinjaman tidak ditemukan");
        if (loan.return_date) throw new Error("Pinjaman sudah dikembalikan");
    
        const diff = newQuantity - loan.quantity;
    
        await db.begin(async (trx) => {
          if (diff !== 0) {
            // Cari uuid buku dari loan
            const bookResult = await trx`
              SELECT b.uuid, b.stock FROM books b
              JOIN loans l ON b.uuid = l.book_uuid
              WHERE l.id = ${loan_id}
            `;
    
            const book = bookResult[0];
    
            if (diff > 0) {
              // Tambah pinjaman → kurangi stock
              if (book.stock < diff) {
                throw new Error("Stock buku tidak mencukupi");
              }
              await trx`
                UPDATE books SET stock = stock - ${diff} WHERE uuid = ${book.uuid}
              `;
            } else {
              // Kurangi pinjaman → tambah stock
              await trx`
                UPDATE books SET stock = stock + ${Math.abs(diff)} WHERE uuid = ${book.uuid}
              `;
            }
          }
    
          // Update quantity di loans
          await LoanRepository.update(loan_id, newQuantity);
        });
    
        return {
          message: "Jumlah pinjaman berhasil diperbarui"
        };
      },

      async deleteLoan(loan_id: string) {
        const loan = await LoanRepository.findById(loan_id);
        if (!loan) throw new Error("Data pinjaman tidak ditemukan");
      
        await db.begin(async (trx) => {
          // Kembalikan stock kalau pinjaman belum dikembalikan
          if (!loan.return_date) {
            // Query yang lebih aman dan jelas
            await trx`
              UPDATE books
              SET stock = stock + ${loan.quantity}
              WHERE uuid = (
                SELECT book_uuid 
                FROM loans 
                WHERE id = ${loan_id}
              )
            `;
          }
      
          // Hapus pinjaman
          await LoanRepository.delete(loan_id);
        });
      
        return {
          message: "Data pinjaman berhasil dihapus"
        };
      }
}