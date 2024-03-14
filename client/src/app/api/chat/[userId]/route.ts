import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        {
          senderId: userId
        },
        {
          receiverId: userId
        }
      ],
    }
  });

  return NextResponse.json(messages, { status: 200 });
}