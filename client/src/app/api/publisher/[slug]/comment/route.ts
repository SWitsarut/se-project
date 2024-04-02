import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

// TableTh>title</TableTh>
//             <TableTh>user</TableTh>
//             <TableTh>rating</TableTh>
//             <TableTh>content</TableTh>
//             <TableTh>date</TableTh>


export const GET = async (req: Request, { params }: { params: { slug: string }}) => {
  try {
    const result = await prisma.comment.findMany({
      where: {
        book: {
          publisher: {
            publisherName: params.slug
          }
        }
      },
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const comments = result.map((comment) => ({
      title: comment.book.title,
      username: comment.user.displayName,
      rating: comment.rating,
      content: comment.content,
      date: comment.createdAt
    }));

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/publisher/[slug]/comment route: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}