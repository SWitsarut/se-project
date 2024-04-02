import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { slug, userId }}: { params: { slug: string, userId: string }}) => {
  try {
    const result = await prisma.bookOwnership.findFirst({
      where: {
        userId,
        book: {
          title: slug
        }
      }
    })

    return NextResponse.json(result ? true : false, { status: 200 });
  } catch (error) {
    console.log("Error at /api/book/[slug]/[userId] GET", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}