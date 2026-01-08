import { db } from "../../config/db";
import { Book, CreateBookDTO } from "./book.model";

export const BookRepository = {
  async findAll(): Promise<Book[]> {
    const books = await db<Book[]>`
      SELECT * FROM books
      ORDER BY id
    `;
    return books;
  },

  async findById(id: string): Promise<Book | null> {
    const book = await db<Book[]>`
      SELECT * FROM books WHERE id = ${id}
    `;
    return book[0] ?? null;
  },

  async create(book: CreateBookDTO): Promise<void> {
    await db`
      INSERT INTO books (
        id, title, category, author, publisher, year, stock
      ) VALUES (
        ${book.id},
        ${book.title},
        ${book.category},
        ${book.author},
        ${book.publisher},
        ${book.year},
        ${book.stock}
      )
    `;
  },

  async update(id: string, book: Partial<CreateBookDTO>) {
    const new_id = book.id ?? id;
    await db`
      UPDATE books SET
        id = ${new_id},
        title = COALESCE(${book.title ?? null}, title),
        category = COALESCE(${book.category ?? null}, category),
        author = COALESCE(${book.author ?? null}, author),
        publisher = COALESCE(${book.publisher ?? null}, publisher),
        year = COALESCE(${book.year ?? null}, year),
        stock = COALESCE(${book.stock ?? null}, stock)
      WHERE id = ${id}
    `;
  },

  async delete(id: string) {
    await db`
      DELETE FROM books WHERE id = ${id}
    `;
  },
};
