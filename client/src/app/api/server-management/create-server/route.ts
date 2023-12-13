import prisma from "@/libs/prisma"
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { serverName, userId } = await req.json();
  try {
    await prisma.server.create({
      data: {
        serverName,
        room: {
          create: {
            roomName: "Hi",
          }
        },
        users: {
          connect: {
            id: userId
          }
        }
      }
    })
    return NextResponse.json("Create server successfully", { status: 201 });
  } catch (error) {
    console.log(error)
  }
}