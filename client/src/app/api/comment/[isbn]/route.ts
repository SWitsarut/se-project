import prisma from "@/libs/prisma";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params: { isbn } }: { params: { isbn: string } },
) => {
  const { userId, content, rating } = await req.json();
  const session = await getCurrentSession();
  
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const isOwned = await prisma.bookOwnership.findUnique({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn
        }
      }
    })

    if(!isOwned) {
      return NextResponse.json({ error: "You must own this book to comment" }, { status: 400 });
    }

    await prisma.comment.create({
      data: {
        userId,
        bookIsbn: isbn,
        content,
        rating,
      }
    })
  
    return NextResponse.json({ message: "Comment successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/comment/[isbn] POST: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
};

export const DELETE = async (req: Request, { params: { isbn }}: { params: { isbn: string }}) => {
  try {
    const { userId } = await req.json();

    const session = await getCurrentSession();

    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.comment.delete({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn
        }
      }
    })

    return NextResponse.json({ message: "Delete comment successful" }, { status: 200});
  } catch (error) {
    console.log("Error at /api/comment/[isbn] DELETE: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}