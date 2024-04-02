import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await prisma.comment.findMany({
      include: {
        user: true,
        book: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    const comments = result.map((comment) => ({
      id: comment.userId + comment.bookIsbn,
      user: {
        displayName: comment.user.displayName,
        avatar: comment.user.avatar,
      },
      bookTitle: comment.book.title,
      content: comment.content,
      rating: comment.rating,
      date: comment.createdAt,
    }))

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/admin/comment: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}