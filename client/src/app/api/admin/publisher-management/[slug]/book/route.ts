import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params: { slug } }: { params: { slug: string } },
) => {
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));
  const search = new URL(req.url).searchParams.get("search");
  
  try {
    const publisher = await prisma.publisher.findUnique({
      where: {
        publisherName: slug
      }
    });

    if(!publisher) {
      return NextResponse.json({ error: "Not found publisher" }, { status: 404 });
    }

    const result = await prisma.book.findMany({
      where: {
        publisher: {
          publisherName: slug
        },
        OR: [
          {title: {
              contains: search || "",
              mode: "insensitive",
          }},
          {isbn: {
            contains: search || "",
            mode: "insensitive",
          }}
        ]
      },
      include: {
        category: true,
        genres: true,
        authors: true,
        publisher: true,
        comment: true
      },
      take,
      skip: take * (page - 1)
    });
  
    const books: BookResponse[] = result.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      price: book.price,
      cover: book.cover,
      pdfUrl: book.pdfUrl,
      description: book.description,
      isSelling: book.isSelling,
      category: book.category.categoryName,
      genres: book.genres.map((genre) => genre.genreName),
      authors: book.authors.map((author) => author.authorName),
      createdAt: formatDate(book.createdAt),
      publisher: book.publisher.publisherName,
      rating: book.comment.length > 0 ? book.comment.reduce((acc, cur) => acc + cur.rating, 0) / book.comment.length : 0,
      ratingCount: book.comment.length
    }))

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};