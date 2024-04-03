import prisma from "@/libs/prisma";
import { BookItemType } from "@/types/book";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const searchParams = new URL(req.url).searchParams.get("sorted-by") || "view-all";
    
    let result;

    switch(searchParams) {
      case "new": {
        result = await prisma.book.findMany({
          where: {
            isSelling: true
          },
          include: {
            publisher: true,
            category: true,
            genres: true,
            authors: true,
            comment: true
          },
          orderBy: {
            createdAt: "desc"
          },
        })
        break;
      }
      case "best-selling": {
        result = await prisma.book.findMany({
          where: {
            isSelling: true
          },
          include: {
            publisher: true,
            category: true,
            genres: true,
            authors: true,
            comment: true
          },
          orderBy: {
            ownedBooks: {
              _count: "asc"
            }
          },
        })
        break;
      }
      default: {
        result =  await prisma.book.findMany({
          where: {
            isSelling: true
          },
          include: {
            publisher: true,
            category: true,
            genres: true,
            authors: true,
            comment: true
          },
          take: 6,
          orderBy: {
            ownedBooks: {
              _count: "asc"
            }
          },
        })
      }
    }
    
    const data: BookItemType[] = result.map((book) => ({
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
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book/view-all GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}