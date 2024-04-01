import prisma from "@/libs/prisma";
import { ChatHistoryData } from "@/types/message";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  const result = await prisma.chatMessage.findMany({
    where: {
      OR: [
        {
          senderId: userId
        },
        {
          receiverId: userId
        }
      ],
    },
    orderBy: {
      timeStamp: "desc"
    },
    include: {
      sender: true,
      receiver: true,
    }
  });

  const messages: ChatHistoryData[] = result.map((message) => ({
    id: message.id,
    content: message.content,
    timeStamp: message.timeStamp,
    sender: {
      id: message.sender.id,
      username: message.sender.username,
      displayName: message.sender.displayName,
      avatar: message.sender.avatar,
    },
    receiver: {
      id: message.receiver?.id,
      username: message.receiver?.username,
      displayName: message.receiver?.displayName,
      avatar: message.receiver?.avatar,
    }
  }))

  return NextResponse.json(messages, { status: 200 });
}