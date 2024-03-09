import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma"
import { ReportFormType } from "@/types/report";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params: { slug } }: { params: { slug: string } }) => {
  const session = await getCurrentSession();

  if (!session || session.user.id !== slug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, isbn, reason }: ReportFormType = await req.json();

  try {
    await prisma.report.create({
      data: {
        userId: userId,
        bookIsbn: isbn,
        reason: reason,
      }
    })
    return NextResponse.json({ message: "Add report successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/report/book/[slug] POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}