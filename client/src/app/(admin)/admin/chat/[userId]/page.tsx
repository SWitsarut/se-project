import MessageInput from "./MessageInput";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";
import { ChatHistoryData } from "@/types/message";
import { Avatar, Text } from "@mantine/core";
import { Fragment } from "react";

interface AdminChatPageProps {
  params: {
    userId: string
  }
}

async function getChatHistory(userId: string): Promise<ChatHistoryData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat/${userId}`, {
    cache: "no-store"
  });

  return res.json();
}

export default async function page({ params: { userId } }: AdminChatPageProps) {
  const session = await getCurrentSession();

  if(!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const messages = await getChatHistory(userId);

  return (
    <div className="flex flex-col w-full p-2">
      <div className={`w-full h-full flex flex-col-reverse overflow-y-auto p-4 gap-2`}>
        {messages.map((message, index) => (
          <Fragment key={index}>
            <div className={`flex gap-1 flex-col max-w-[50%] ${message.sender.id === userId ? "self-start" : "self-end"}`}>
              <div className={`flex items-center ${message.sender.id === userId ? "justify-start" : "justify-end"}`}>
                <Avatar size="md" src={null} alt="sender" />
                <Text size="xs">{message.sender.displayName}</Text>
              </div>
              <div className={`break-words text-wrap border p-2 rounded-lg w-fit self-end ${message.sender.id === userId ? "bg-white text-black" : "bg-primary text-white"}`}>
                <Text>{message.content}</Text>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <MessageInput senderId={session.user.id} receiverId={userId} />
    </div>
  )
}
