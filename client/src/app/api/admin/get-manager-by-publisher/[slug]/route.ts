import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params: { slug } }: { params: { slug: string } },
) => {
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));
  const search = new URL(req.url).searchParams.get("search");

  try {
    const result = await prisma.user.findMany({
      where: {
        publisher: {
          publisherName: slug
        },
        username: {
          contains: search || ""
        }
      },
      take,
      skip: take * (page - 1)
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