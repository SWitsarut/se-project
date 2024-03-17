import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const result = await prisma.book.findMany({
      include: {
        publisher: true,
        category: true,
        genres: true,
        authors: true,
        ownedBooks: true
      },
      take: 6,
      orderBy: {
        createdAt: "desc"
      }
    });

    const newBooks: BookResponse[] = result.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      price: book.price,
      cover: book.cover,
      pdfUrl: book.pdfUrl,
      isSelling: book.isSelling,
      description: book.description,
      genres: book.genres.map((genre) => genre.genreName),
      authors: book.authors.map((author) => author.authorName),
      category: book.category.categoryName,
      createdAt: formatDate(book.createdAt),
      publisher: book.publisher.publisherName
    }))

    return NextResponse.json(newBooks, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book GET", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}