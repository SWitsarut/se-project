import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/session";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params: { isbn } }: { params: { isbn: string } },
) => {
  const user = await getCurrentUser();
  
  if(!user || user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const publisher = await prisma.publisher.findFirst({
      where: {
        staffs: {
          some: {
            id: user.id
          }
        }
      }
    })

    if(!publisher || !publisher.publisherName) {
      return NextResponse.json({ error: "Publisher is required" }, { status: 403 });
    }

    await prisma.book.delete({
      where: {
        isbn,
        publisher: {
          publisherName: publisher.publisherName
        },
      }
    });

    return NextResponse.json({ message: "Delete book successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/manage-book/[isbn] DELETE");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
