"use client";

interface MessageContentProps {
  messages: any
}

export default function MessageContent({ messages }: MessageContentProps) {

  return (
    <div>{messages.map((message: any) => (
      <div key={message.id}>{message.content}</div>
    ))}</div>
  )
}
