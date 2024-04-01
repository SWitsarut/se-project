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

export const PATCH = async (req: Request, { params: { reportId }}: { params: { reportId: string}}) => {
  const session = await getCurrentSession();
  const {status} = await req.json();

  if(!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.report.update({
      where: {
        id: Number(reportId)
      },
      data: {
        status: status
      }
    });
    
    

    return NextResponse.json({ message: "Change report status successful"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}