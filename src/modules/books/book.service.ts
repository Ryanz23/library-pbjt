import { BookRepository } from "./book.repository";
import { CreateBookDTO } from "./book.model";

export const BookService = {
    async getAllBooks() {
        return await BookRepository.findAll();
    },

    async getBookById(id: string) {
        const book = await BookRepository.findById(id);
        if (!book) throw new Error("Buku tidak ditemukan");
        return book;
    },

    async addBook(data: CreateBookDTO) {
        if (data.stock < 0) {
            throw new Error("Stock tidak boleh minus");
        }

        await BookRepository.create(data);

        return {
            message: "Buku berhasil ditambahkan"
        };
    },

    async updateBook(id: string, data: Partial<CreateBookDTO>) {
        const book = await BookRepository.findById(id);
        if (!book) throw new Error("Buku tidak ditemukan");

        if (data.stock !== undefined && data.stock < 0) {
            throw new Error("Stock tidak boleh minus");
        }

        await BookRepository.update(id, data);
        return {
            message: "Buku berhasil diperbarui"
        }
    },

    async deleteBook(id: string) {
        const book = await BookRepository.findById(id);
        if (!book) throw new Error("Buku tidak ditemukan");

        await BookRepository.delete(id);
        return { message: "Buku berhasil dihapus" };
    }
}