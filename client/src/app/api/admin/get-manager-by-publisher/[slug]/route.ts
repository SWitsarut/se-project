import prisma from "@/libs/prisma";
import { BookResponse } from "@/types/book";
import { formatDate } from "@/utils/formatDate";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params: { slug } }: { params: { slug: string } },
) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: {
        publisherName: slug
      }
    })

    if(!publisher) {
      return NextResponse.json({ error: "Not found publisher" }, { status: 404 });
    }

    const result = await prisma.user.findMany({
      where: {
        publisher: {
          publisherName: slug
        },
      }
    });
  
    const managers = result.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      isActive: user.isActive,
      role: user.role
    }))

    return NextResponse.json({ managers }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};