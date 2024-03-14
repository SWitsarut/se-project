import prisma from "@/libs/prisma";
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { senderId, content, receiverId } = await req.json();
    
    await prisma.chatMessage.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: receiverId ? { id: receiverId } : undefined,
        },
        content,
      }
    });

    return NextResponse.json({ message: "Send message success" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}