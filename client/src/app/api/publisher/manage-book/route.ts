import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOption } from "@/libs/authOption";
import { NextResponse } from "next/server";
import { AddbookFormType } from "@/types/book";

// add book
export const POST = async (req: Request) => {
  const session = await getServerSession(authOption);

  if(!session || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }
  
  const publisher = await prisma.publisher.findFirst({
    where: {
      manager: {
        some: {
          username: session.user.username,
        }
      }
    }
  })

  if(!publisher || !publisher.publisherName) {
    return NextResponse.json({ message: "Publisher is required" }, { status: 403 });
  }

  const { isbn, title, cover, price, categoryName, authorNames, genreNames, pdfUrl, description }: AddbookFormType = await req.json();
  
  try {
    const existingBook = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn },
          { title },
        ]
      }
    })

    if(existingBook) {
      return NextResponse.json({ message: "Already have a book." }, { status: 400 });
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
    console.log(error);
    return NextResponse.json({ message: "Internal Server"}, { status: 500 })
  }
}