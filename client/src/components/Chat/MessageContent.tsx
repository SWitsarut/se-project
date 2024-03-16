"use client";

interface MessageContentProps {
  userId: string
  messages: any
}

export default function MessageContent({ messages, userId }: MessageContentProps) {
  return (
    <div className="flex flex-col-reverse">
      {messages.map((message: any) => (
        <div className={`${message.senderId === userId && "text-end"}`} key={message.id}>{message.content}</div>
      ))}
    </div>
  )
}
