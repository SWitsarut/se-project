import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/session";
import { NextResponse } from "next/server"

export const PUT = async (req: Request, { params : { userId }}: { params : { userId: string}}) => {
  const { role, status, publisherName } = await req.json();
  const user = await getCurrentUser();

  if(!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if(role == "PUBLISHER") {
      if(!publisherName) {
        return NextResponse.json({ error: "Publisher name is required" }, { status: 400 });
      }

      const publisher = await prisma.publisher.findUnique({
        where: {
          publisherName,
        }
      })
  
      if(!publisher) {
        return NextResponse.json({ error: "Not found publisher name" }, { status: 400 });
      }

      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          role: role,
          isActive: status == "Active" ? true : false,
          publisher: {
            connect: {
              publisherName: publisher.publisherName
            }
          }
        }
      })

      return NextResponse.json({ message: "Update user successful"}, { status: 200 });
    }
    
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role: role,
        isActive: status == "Active" ? true : false,
        publisher: {
          disconnect: {
            publisherName
          }
        }
      }
    })

    return NextResponse.json({ message: "Update user successful" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}

export const DELETE = async (req: Request, { params: { userId }}: { params: { userId: string}}) => {
  const user = await getCurrentUser();

  if(!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId
      }
    })

    return NextResponse.json({ message: "Delete user successful"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}