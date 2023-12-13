import { authOptions } from "@/libs/authOptions";
import prisma from "@/libs/prisma"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if(!session) {
    return NextResponse.json("Unauthorize" ,{ status: 401 })
  }
  
  const { message, serverId, roomId } = await req.json();
  
  try {
    await prisma.message.create({
      data: {
        message,
        userId: session.user.id,
        roomId: roomId,
      },
    })
    
    return NextResponse.json("sent message successfully", { status: 200 })
  } catch (error) {
    console.log(error)
  }
}