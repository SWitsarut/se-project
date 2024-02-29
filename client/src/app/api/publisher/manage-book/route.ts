import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { AddbookFormType } from "@/types/book";
import { getCurrentUser } from "@/libs/session";

// add book
export const POST = async (req: Request) => {
  const user = await getCurrentUser();

  if(!user || user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { isbn, title, cover, price, categoryName, authorNames, genreNames, pdfUrl, description }: AddbookFormType = await req.json();
  
  if(!isbn || !title || !price || !categoryName) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  if(Number(price) < 0) {
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
            id: user.id
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
    })

    if(existingBook) {
      return NextResponse.json({ error: "Already have a book" }, { status: 400 });
    }

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
    console.log("Error at /api/publisher/manage-book POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}