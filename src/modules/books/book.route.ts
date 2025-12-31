import { Elysia, t } from "elysia";
import { BookService } from "./book.service";
import { CreateBookDTO } from "./book.model";

export const bookRoute = new Elysia({ prefix: "/books" })
  // GET /books
  .get("/", async () => {
    const books = await BookService.getAllBooks();
    return Response.json(books);
  })

  // GET /books/:id
  .get("/:id", async ({ params }) => {
    const book = await BookService.getBookById(params.id);
    return Response.json(book);
  })

  // POST /books
  .post(
    "/",
    async ({ body }) => {
      return await BookService.addBook(body as CreateBookDTO);
    },
    {
      body: t.Object({
        id: t.String(),
        title: t.String(),
        category: t.String(),
        author: t.String(),
        publisher: t.String(),
        year: t.Number(),
        stock: t.Number({ minimum: 0 })
      })
    }
  )

  // PUT /books/:id
  .put(
    "/:id",
    async ({ params, body }) => {
      return Response.json(
        await BookService.updateBook(params.id as string, body as Partial<CreateBookDTO>)
      );
    }
  )

  .delete(
    "/:id",
    async ({ params }) => {
      return Response.json(
        await BookService.deleteBook(params.id as string)
      );
    }
  )