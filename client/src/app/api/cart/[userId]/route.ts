import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  try {
    const result = await prisma.cartItem.findMany({
      where: {
        userId,
      }
    })

    const isbn = result.map((cart) => cart.bookIsbn);

    return NextResponse.json(isbn, { status: 200 });
  } catch (error) {
    console.log("Error at /api/cart/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  const { isbn } = await req.json();
  
  try {
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
  const { isbn } = await req.json();

  try {
    const existingInCart = await prisma.cartItem.findUnique({
      where: {
        userId_bookIsbn: {
          userId,
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
          userId,
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