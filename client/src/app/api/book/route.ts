import prisma from "@/libs/prisma";
import { BookItemType } from "@/types/book";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const [resultNew, resultBestSelling] = await Promise.all([
      await prisma.book.findMany({
        where: {
          isSelling: true
        },
        include: {
          publisher: true,
          category: true,
          genres: true,
          authors: true,
          comment: true,
          ownedBooks: true
        },
        take: 6,
        orderBy: {
          createdAt: "desc"
        },
      }),
      await prisma.book.findMany({
        where: {
          isSelling: true
        },
        include: {
          publisher: true,
          category: true,
          genres: true,
          authors: true,
          comment: true,
          ownedBooks: true
        },
        take: 6,
        orderBy: {
          ownedBooks: {
            _count: "asc"
          }
        },
      }),
    ]);

    const newBooks: BookItemType[] = resultNew.map((book) => ({
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
      owned: book.ownedBooks.map((data) => data.userId)
    }))
    
    const bestSelling: BookItemType[] = resultBestSelling.map((book) => ({
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
      owned: book.ownedBooks.map((data) => data.userId)
    }))

    return NextResponse.json({ newBooks, bestSelling }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book GET", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}