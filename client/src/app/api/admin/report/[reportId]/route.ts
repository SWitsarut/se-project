import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request, { params: { reportId }}: { params: { reportId: string}}) => {
  const session = await getCurrentSession();

  if(!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    await prisma.report.delete({
      where: {
        id: Number(reportId)
      }
    })

    return NextResponse.json({ message: "Delete report successful"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}

export const PUT = async (req: Request, { params: { reportId }}: { params: { reportId: string}}) => {
  const session = await getCurrentSession();

  const { status } = await req.json();

  console.log(status)

  if(!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if(status !== "REVIEWED" && status !== "DISMISSED" && status !== "PENDING") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    await prisma.report.update({
      where: {
        id: Number(reportId)
      },
      data: {
        status,
      }
    })

    return NextResponse.json({ message: "Update report status" }, { status: 200 });
  } catch (error) {
    console.log("Error at PUT /api/report/[reportId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const PATCH = async (req: Request, { params: { reportId }}: { params: { reportId: string}}) => {
  const session = await getCurrentSession();
  
  const { isbn } = await req.json();

  if(!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if(!isbn) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  try {
    await prisma.report.update({
      where: {
        id: Number(reportId),
      },
      data: {
        status: "REVIEWED"
      }
    });

    await prisma.book.update({
      where: {
        isbn
      },
      data: {
        isBlocked: true,
        isSelling: false,
      }
    })

    return NextResponse.json({ message: "Report is reviewed"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}