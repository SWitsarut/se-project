import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId, isbn } }: { params: { userId: string, isbn: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Not found user" }, { status: 400 });
    }

    const isInWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn
        }
      }
    })

    const isInLibrary = await prisma.bookOwnership.findUnique({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn
        }
      }
    });

    return NextResponse.json({ isInWishlist: isInWishlist ? true : false, isInLibrary: isInLibrary ? true : false }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId]/[isbn]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}