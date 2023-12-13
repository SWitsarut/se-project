import prisma from "@/libs/prisma"
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { roomName, serverId } = await req.json();
  
  try {
    await prisma.room.create({
      data: {
        roomName,
        server: {
          connect: {
            id: serverId
          },
        }
      },
    })
    return NextResponse.json("Create room successfully", { status: 201 })
  } catch (error) {
    console.log(error);
  }
}