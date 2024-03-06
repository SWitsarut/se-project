import prisma from "@/libs/prisma";
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
          }
        }
      }
    });

    const isbn = result.map((cart) => cart.book.isbn);

    return NextResponse.json(isbn, { status: 200 });
  } catch (error) {
    console.log("Error at /api/cart/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}