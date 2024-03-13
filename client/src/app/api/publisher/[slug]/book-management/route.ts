import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { AddBookFormType, BookResponse } from "@/types/book";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { formatDate } from "@/utils";

// get book
export const GET = async (req: Request, { params: { slug }}: { params: { slug: string }}) => {
  try {
    const result = await prisma.book.findMany({
      where: {
        publisher: {
          publisherName: slug
        }
      },
      include: {
        publisher: true,
        genres: true,
        authors: true,
        category: true
      }
    });

    const books: BookResponse[] = result.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      price: book.price,
      cover: book.cover,
      pdfUrl: book.pdfUrl,
      description: book.description,
      isSelling: book.isSelling,
      genres: book.genres.map((genre) => genre.genreName),
      authors: book.authors.map((author) => author.authorName),
      category: book.category.categoryName,
      createdAt: formatDate(book.createdAt),
      publisher: book.publisher.publisherName
    }));

    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/book-management GET", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// add book
export const POST = async (
  req: Request,
  { params: { slug } }: { params: { slug: string } }
) => {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER" || session.user.publisher !== slug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { isbn, title, cover, price, categoryName, authorNames, genreNames, pdfUrl, description }: AddBookFormType = await req.json();
  
  if(!isbn || !title || !price || !categoryName) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  if(isNaN(Number(price)) || Number(price) < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  
  if(authorNames.length < 1) {
    return NextResponse.json({ error: "Author is required at least 1 author" }, { status: 400 });
  }

  if(!cover) {
    return NextResponse.json({ error: "Image cover is required" }, { status: 400 })
  }

  if(!pdfUrl) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }

  try {
    const publisher = await prisma.publisher.findFirst({
      where: {
        staffs: {
          some: {
            id: session.user.id
          }
        }
      }
    })
  
    if(!publisher || !publisher.publisherName) {
      return NextResponse.json({ error: "Publisher is required" }, { status: 403 });
    }

    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn },
          { title },
        ]
      }
    });

    if(existingBook) {
      return NextResponse.json({ error: "Already have a book" }, { status: 400 });
    };

    await prisma.book.create({
      data: {
        isbn,
        title,
        price: Number(price),
        description,
        cover,
        pdfUrl,
        category: {
          connectOrCreate: {
            where: { categoryName },
            create: { categoryName },
          },
        },
        publisher: {
          connect: {
            publisherName: publisher.publisherName
          }
        },
        genres: {
          connectOrCreate: genreNames.map(name => ({
            where: { genreName: name },
            create: { genreName: name },
          }))
        },
        authors: {
          connectOrCreate: authorNames.map(name => ({
            where: { authorName: name },
            create: { authorName: name },
          }))
        },
      },
    });

    return NextResponse.json({ message: "Add book successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/book-management POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}