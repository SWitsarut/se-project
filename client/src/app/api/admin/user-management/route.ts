import prisma from "@/libs/prisma";
import { User } from "@/types/user";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const search = new URL(req.url).searchParams.get("search");
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));
  
  try {
    const result = await prisma.user.findMany({
      include: {
        publisher: true
      },
      where: {
        username: {
          contains: search || ""
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: take,
      skip: take * (page - 1)
    });

    const users: User[] = result.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      publisherName: user.publisher?.publisherName
    }))

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}