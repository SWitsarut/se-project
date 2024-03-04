import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils/formatDate";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { slug }}: { params: { slug: string }}) => {
  try {
    const result = await prisma.book.findUnique({
      where: {
        title: slug,
        isSelling: true
      },
      include: {
        genres: true,
        authors: true,
        category: true,
        publisher: true,
      }
    });

    if(!result) {
      return NextResponse.json({ error: "Not found book" }, { status: 404 });
    }

    const book:BookResponse = {
      isbn: result.isbn,
      title: result.title,
      price: result.price,
      cover: result.cover,
      pdfUrl: result.pdfUrl,
      isSelling: result.isSelling,
      description: result.description,
      genres: result.genres.map((genre) => genre.genreName),
      authors: result.authors.map((author) => author.authorName),
      category: result.category.categoryName,
      createdAt: formatDate(result.createdAt),
      publisher: result.publisher.publisherName
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book/[slug] GET", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}