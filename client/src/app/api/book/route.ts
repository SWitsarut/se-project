import prisma from "@/libs/prisma";
import { BookItemType } from "@/types/book";
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
        comment: true
      },
      take: 6,
      orderBy: {
        createdAt: "desc"
      },
    });

    const newBooks: BookItemType[] = result.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      price: book.price,
      cover: book.cover,
      description: book.description,
      authors: book.authors.map((author) => author.authorName),
      category: book.category.categoryName,
      publisher: book.publisher.publisherName,
      rating: book.comment.length > 0 ? book.comment.reduce((acc, cur) => acc + cur.rating, 0) / book.comment.length : 0,
      ratingCount: book.comment.length,
    }))

    return NextResponse.json(newBooks, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book GET", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}