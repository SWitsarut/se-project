import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { EditBookData } from "@/types/book";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params: { isbn } }: { params: { isbn: string}}
) => {
  try {
    const result = await prisma.book.findUnique({
      where: {
        isbn
      },
      include: {
        authors: true,
        genres: true,
        category: true,
      }
    })

    if(!result) {
      return NextResponse.json({ error: "Not found book" }, { status: 404 });
    }
  
    const book: EditBookData = {
      isbn: result.isbn,
      title: result.title,
      price: result.price,
      cover: result.cover,
      pdfUrl: result.pdfUrl,
      isSelling: result.isSelling,
      authorNames: result.authors.map((author) => author.authorName),
      genreNames: result.genres.map((genre) => genre.genreName),
      categoryName: result.category.categoryName,
      description: result.description,
    }
  
    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/book-management/[isbn] GET", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const PUT = async (
  req: Request,
  { params: { slug, isbn } }: { params: { slug: string, isbn: string}}
) => {
  const session = await getCurrentSession();
  
  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if(session.user.publisher !== slug) {
    return NextResponse.json({ error: "Forbidden"}, { status: 403 });
  }
  
  const { title, cover, price, categoryName, authorNames, genreNames, pdfUrl, description, isSelling }: EditBookData = await req.json();

  if(!title || !price || !categoryName) {
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

  if(!cover) {
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
    });
  
    if(!publisher || !publisher.publisherName || session.user.publisher !== publisher.publisherName) {
      return NextResponse.json({ error: "Publisher is required" }, { status: 403 });
    }

    const book = await prisma.book.findUnique({
      where: {
        isbn,
      }
    });

    if(!book) {
      return NextResponse.json({ error: "Not found book"}, { status: 404 });
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        title,
        NOT: { isbn}
      }
    });

    if(existingBook) {
      return NextResponse.json({ error: "Already have a book"}, { status: 400 })
    }

    await prisma.book.update({
      where: {
        isbn: book.isbn
      },
      data: {
        title,
        price: Number(price),
        description,
        cover,
        isSelling: isSelling,
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
      }
    })

    return NextResponse.json({ message: "Update book successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/book-management/[isbn] PUT", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const DELETE = async (
  req: Request,
  { params: { slug, isbn } }: { params: { slug: string, isbn: string } },
) => {
  const session = await getCurrentSession();
  
  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if(session.user.publisher !== slug) {
    return NextResponse.json({ error: "Forbidden"}, { status: 403 });
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
    });

    if(!publisher || !publisher.publisherName) {
      return NextResponse.json({ error: "Publisher is required" }, { status: 403 });
    }

    await prisma.book.delete({
      where: {
        isbn,
        publisher: {
          publisherName: publisher.publisherName
        },
      }
    });

    return NextResponse.json({ message: "Delete book successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/book-management/[isbn] DELETE", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};