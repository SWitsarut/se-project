import prisma from "@/libs/prisma";
import { BookShelfType } from "@/types/book";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const result = await prisma.bookOwnership.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            category: true,
            authors: true,
            publisher: true
          }
        }
      }
    })

    const books: BookShelfType[] = result.map((ownedBook) => ({
      isbn: ownedBook.book.isbn,
      title: ownedBook.book.title,
      cover: ownedBook.book.cover,
      category: ownedBook.book.category.categoryName,
      pdfUrl: ownedBook.book.pdfUrl,
      authors: ownedBook.book.authors.map((author) => author.authorName),
      publisher: ownedBook.book.publisher.publisherName,
    }));
  
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.log("Error at /api/bookshelf/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}