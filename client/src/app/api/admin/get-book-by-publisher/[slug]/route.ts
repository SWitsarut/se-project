import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils/formatDate";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params: { slug } }: { params: { slug: string } },
) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: {
        publisherName: slug
      }
    })

    if(!publisher) {
      return NextResponse.json({ error: "Not found publisher" }, { status: 404 });
    }

    const result = await prisma.book.findMany({
      where: {
        publisher: {
          publisherName: slug
        },
      },
      include: {
        category: true,
        genres: true,
        authors: true,
      },
    });
  
    const books: BookResponse[] = result.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      price: book.price,
      cover: book.cover,
      pdfUrl: book.pdfUrl,
      isSelling: book.isSelling,
      category: book.category.categoryName,
      genres: book.genres.map((genre) => genre.genreName),
      authors: book.authors.map((author) => author.authorName),
      createdAt: formatDate(book.createdAt),
    }))

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};