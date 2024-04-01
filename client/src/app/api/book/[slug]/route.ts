import prisma from "@/libs/prisma";
import { BookResponseWithComments } from "@/types/book";
import { formatDate } from "@/utils";
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
        comment: {
          include: {
            user: true
          }
        },
      },
    });

    if(!result) {
      return NextResponse.json({ error: "Not found book" }, { status: 404 });
    }

    const book: BookResponseWithComments = {
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
      publisher: result.publisher.publisherName,
      comments: result.comment.map((comment) => ({
        content: comment.content,
        rating: comment.rating,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          displayName: comment.user.displayName,
          avatar: comment.user.avatar || null,
        },
        createdAt: comment.createdAt,
      })),
      rating: result.comment.length > 0 ? result.comment.reduce((acc, cur) => acc + cur.rating, 0) / result.comment.length : 0,
      ratingCount: result.comment.length,
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book/[slug] GET", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}