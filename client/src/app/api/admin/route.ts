import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const [userCount, adminCount, publisherCount, totalOrder, totalBook] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "PUBLISHER" } }),
      prisma.userOrder.count(),
      prisma.book.count(),
    ]);

    return NextResponse.json({ userCount, adminCount, publisherCount, totalOrder, totalBook }, { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/admin route: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}