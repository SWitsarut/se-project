import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils";
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const searchBy = new URL(req.url).searchParams.get("search-by") || "book-title";
    const searchQuery = new URL(req.url).searchParams.get("search-query") || "";
    const page = Number(new URL(req.url).searchParams.get("page")) || 1;
    const take = Number(new URL(req.url).searchParams.get("take")) || 20;

    let result, count;

    switch (searchBy) {
      case "publisher": {
        [result, count] = await Promise.all([
          await prisma.book.findMany({
            where: {
              publisher: {
                publisherName: {
                  contains: searchQuery,
                  mode: "insensitive"
                }
              }
            },
            include: {
              category: true,
              genres: true,
              authors: true,
              publisher: true,
              comment: true
            },
            take,
            skip: (page - 1) * take
          }),
          await prisma.book.count({
            where: {
              publisher: {
                publisherName: {
                  contains: searchQuery,
                  mode: "insensitive"
                }
              }
            },
          })
        ]);
        break;
      }
      case "author": {
        [result, count] = await Promise.all([
          await prisma.book.findMany({
            where: {
              authors: {
                some: {
                  authorName: {
                    contains: searchQuery,
                    mode: "insensitive"
                  }
                }
              }
            },
            include: {
              category: true,
              genres: true,
              authors: true,
              publisher: true,
              comment: true
            },
            take,
            skip: (page - 1) * take
          }),
          await prisma.book.count({
            where: {
              authors: {
                some: {
                  authorName: {
                    contains: searchQuery,
                    mode: "insensitive"
                  }
                }
              }
            },
          })
        ]);
        break;
      }
      case "genre": {
        [result, count] = await Promise.all([
          await prisma.book.findMany({
            where: {
              genres: {
                some: {
                  genreName: {
                    contains: searchQuery,
                    mode: "insensitive"
                  }
                }
              }
            },
            include: {
              category: true,
              genres: true,
              authors: true,
              publisher: true,
              comment: true
            },
            take,
            skip: (page - 1) * take
          }),
          await prisma.book.count({
            where: {
              genres: {
                some: {
                  genreName: {
                    contains: searchQuery,
                    mode: "insensitive"
                  }
                }
              }
            },
          })
        ]);
        break;
      }
      default: {
        [result, count] = await Promise.all([
          await prisma.book.findMany({
            where: {
              title: {
                contains: searchQuery,
                mode: "insensitive"
              }
            },
            include: {
              category: true,
              genres: true,
              authors: true,
              publisher: true,
              comment: true
            },
            take,
            skip: (page - 1) * take
          }),
          await prisma.book.count({
            where: {
              title: {
                contains: searchQuery,
                mode: "insensitive",
              }
            },
          })
        ]);
      }
    }

    const data: BookResponse[] = result.map((book) => ({
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
    
    const totalPage = Math.ceil(count / take);

    return NextResponse.json({ data, totalPage }, { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/search: ", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}