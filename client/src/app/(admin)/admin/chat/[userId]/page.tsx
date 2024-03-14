import prisma from "@/libs/prisma";
import MessageInput from "./MessageInput";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

interface AdminChatPageProps {
  params: {
    userId: string
  }
}

export default async function page({ params: { userId } }: AdminChatPageProps) {
  const session = await getCurrentSession();

  if(!session) {
    redirect("/login")
  }

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

  return (
    <div className="flex flex-col">
      {messages.map((message) => (
        <div key={message.id} className={`${message.senderId !== userId && "text-end"}`}>
          <p>{message.content}</p>
        </div>
      ))}
      <MessageInput senderId={session.user.id} receiverId={userId} />
    </div>
  )
}
