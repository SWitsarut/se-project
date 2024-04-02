import prisma from "@/libs/prisma"
import { getCurrentSession } from "@/libs/getCurrentSession";
import { ReportFormType } from "@/types/report";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await getCurrentSession();

  const { userId, reason, isbn }: ReportFormType = await req.json();

  if(!userId || !reason || !isbn) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const existingReport = await prisma.report.findFirst({
      where: {
        userId: userId,
        bookIsbn: isbn,
      }
    });

    if(existingReport) {
      return NextResponse.json({ error: "You have already reported this book" }, { status: 400 });
    }

    await prisma.report.create({
      data: {
        userId: userId,
        bookIsbn: isbn,
        reason: reason,
      }
    })
    return NextResponse.json({ message: "Report successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/report POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}