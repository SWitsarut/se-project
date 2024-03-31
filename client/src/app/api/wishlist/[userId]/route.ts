import { getCurrentSession } from "@/libs/getCurrentSession";
import { BookWislist } from "@/types/book";
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

    const result = await prisma.wishlist.findMany({
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

    const wishlists: BookWislist[] = result.map((wishlist) => ({
      isbn: wishlist.book.isbn,
      title: wishlist.book.title,
      cover: wishlist.book.cover,
      price: wishlist.book.price
    }));

    return NextResponse.json(wishlists, { status: 200 });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId]", error);
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
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const existingInWishlit = await prisma.wishlist.findFirst({
      where: {
        userId,
        bookIsbn: isbn,
      }
    })

    if (existingInWishlit) {
      await prisma.wishlist.delete({
        where: {
          userId_bookIsbn: {
            userId,
            bookIsbn: isbn
          }
        }
      })
      return NextResponse.json({ message: "Remove from wishlist successful" }, { status: 200 });
    }

    await prisma.wishlist.create({
      data: {
        userId,
        bookIsbn: isbn
      }
    });

    return NextResponse.json({ message: "Add to wishlist successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId] POST", error);
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
    const existingInFavorite = await prisma.wishlist.findUnique({
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

    await prisma.wishlist.delete({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn,
        }
      }
    })

    return NextResponse.json({ message: "Remove from wishlist successful" });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}