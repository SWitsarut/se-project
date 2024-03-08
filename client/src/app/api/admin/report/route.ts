import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const search = new URL(req.url).searchParams.get("search");
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));

  try {
    const result = await prisma.report.findMany({
      include: {
        user: true
      },
      where: {
        user: {
          username: {
            contains: search || ""
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: take,
      skip: take * (page - 1)
    });

    const reports: Report[] = result.map((report) => ({
      id: report.id,
      username: report.user.username,
      avatar: report.user.avatar,
      role: report.user.role,
      reason: report.reason,
      status: report.status,
      createAt: report.createdAt,
    }))

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}