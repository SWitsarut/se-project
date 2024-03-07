import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { BookCart } from "@/types/book";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if(!user) {
      return NextResponse.json({ error: "Not found user" }, { status: 400 });
    }

    const result = await prisma.cartItem.findMany({
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

    const carts: BookCart[] = result.map((cart) => ({
      isbn: cart.book.isbn,
      title: cart.book.title,
      cover: cart.book.cover,
      price: cart.book.price
    }));

    return NextResponse.json(carts, { status: 200 });
  } catch (error) {
    console.log("Error at /api/cart/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
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

    if(!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const existingInCart = await prisma.cartItem.findFirst({
      where: {
        userId,
        bookIsbn: isbn,
      }
    })

    if(existingInCart) {
      return NextResponse.json({ error: "This book is existing in cart" }, { status: 400 });
    }
    
    await prisma.cartItem.create({
      data: {
        userId,
        bookIsbn: isbn
      }
    });

    return NextResponse.json({ message: "Add to cart successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/cart/[userId] POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const DELETE = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
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

    if(!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const existingInCart = await prisma.cartItem.findUnique({
      where: {
        userId_bookIsbn: {
          userId: userId,
          bookIsbn: isbn
        }
      }
    })

    if(!existingInCart) {
      return NextResponse.json({ error: "This book is not existing in cart" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        userId_bookIsbn: {
          userId: userId,
          bookIsbn: isbn,
        }
      }
    })
    
    return NextResponse.json({ message: "Remove from cart successful" });
  } catch (error) {
    console.log("Error at /api/cart/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}