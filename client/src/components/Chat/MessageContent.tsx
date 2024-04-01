"use client";

import { ChatHistoryData } from "@/types/message";
import { Avatar, Text } from "@mantine/core";
import { Fragment } from "react";

interface MessageContentProps {
  userId: string
  messages: ChatHistoryData[]
}

export default function MessageContent({ messages, userId }: MessageContentProps) {
  console.log(messages)
  return (
    <div className={`flex flex-col-reverse gap-2 w-full h-96 relative overflow-y-auto p-2`}>
      {messages.map((message, index: number) => (
        <Fragment key={index}>
          <div className={`${message.sender.id === userId ? "self-end" : "self-start"} max-w-[70%]`}>
            <div className="flex items-center justify-end">
              <Avatar size="sm" src={null} alt="sender" />
              <Text size="xs">{message.sender.id === userId ? "You" : "Admin" }</Text>
            </div>
            <div className={`break-words text-wrap border p-2 rounded-lg ${message.sender.id === userId ? "bg-primary text-white" : "bg-white text-black" }`}>
              <Text>{message.content}</Text>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
