import prisma from "@/libs/prisma";
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));

  const publishers = await prisma.publisher.findMany({
    skip: take * (page - 1),
    take: take,
  });

  const count = await prisma.publisher.count();

  const totalPage = Math.ceil(count/take);
  
  return NextResponse.json({publishers, totalPage}, { status: 200 });
}