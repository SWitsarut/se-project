import { getCurrentSession } from "@/libs/getCurrentSession";
import { BookFavorite } from "@/types/book";
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export const GET = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {

  try {

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Not found user" }, { status: 400 });
    }

    const result = await prisma.favorite.findMany({
      where: {
        userId,
      },
      select: {
        book: {
          select: {
            isbn: true,
            title: true,
            cover: true,
            price: true,
          }
        }
      }
    })

    const favorites: BookFavorite[] = result.map((favorite) => ({
      isbn: favorite.book.isbn,
      title: favorite.book.title,
      cover: favorite.book.cover,
      price: favorite.book.price
    }));

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.log("Error at /api/favorite/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
  const session = await getCurrentSession();
  
  if(!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" } ,{ status: 403 });
  }

  const { isbn } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const existingInFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        bookIsbn: isbn,
      }
    })

    const existingInLibrary = await prisma.bookOwnership.findFirst({
      where: {
        userId,
        bookIsbn: isbn,
      }
    });

    if (existingInFavorite) {
      return NextResponse.json({ error: "This book is existing in favorite list" }, { status: 400 });
    }

    if (!existingInLibrary) {
      return NextResponse.json({ error: "This book is not existing in library" }, { status: 400 })
    }

    await prisma.favorite.create({
      data: {
        userId,
        bookIsbn: isbn
      }
    });

    return NextResponse.json({ message: "Add to favorite successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/favorite/[userId] POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const DELETE = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
  const session = await getCurrentSession();
  
  if(!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" } ,{ status: 403 });
  }
  
  const { isbn } = await req.json();

  try {
    const existingInFavorite = await prisma.favorite.findUnique({
      where: {
        userId_bookIsbn: {
          userId: userId,
          bookIsbn: isbn
        }
      }
    })

    if (!existingInFavorite) {
      return NextResponse.json({ error: "This book is not existing in cart" }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn,
        }
      }
    })

    return NextResponse.json({ message: "Remove from favorite successful" });
  } catch (error) {
    console.log("Error at /api/favorite/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}