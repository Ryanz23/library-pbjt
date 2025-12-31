export interface Loan {
    id: string;                    // UUID internal (untuk URL & relasi)
    uuid: string;             // "LN000001" — yang ditampilkan ke user
    book_id: string;
    book_title?: string;
    member_id: string;
    member_name?: string;
    quantity: number;
    loan_date: string;
    return_date?: string | null;
  }

export interface CreateLoanDTO {
    id: string;
    book_id: string;
    member_id: string;
    quantity: number;
    loan_date: string;
}