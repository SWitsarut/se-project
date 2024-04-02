import prisma from "@/libs/prisma";
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {
    const { senderId, content, receiverId } = await req.json();

    if(!senderId || !content) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
    await prisma.chatMessage.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: receiverId ? { id: receiverId } : undefined,
        },
        content: content.trim(),
      },
    });

    return NextResponse.json({ message: "Send message success" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}