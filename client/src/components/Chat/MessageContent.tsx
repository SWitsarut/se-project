"use client";

import { ChatHistoryData } from "@/types/message";
import { Avatar, Text } from "@mantine/core";
import { Fragment } from "react";

interface MessageContentProps {
  userId: string
  messages: ChatHistoryData[]
}

export default function MessageContent({ messages, userId }: MessageContentProps) {
  return (
    <div className={`flex flex-col-reverse gap-2 w-full h-96 relative overflow-y-auto p-2`}>
      {messages.map((message, index: number) => (
        <Fragment key={index}>
          <div className={`flex flex-col max-w-[70%] gap-1 ${message.sender.id === userId ? "self-end" : "self-start"}`}>
            <div className={`flex items-center gap-2 ${message.sender.id === userId ? "flex-row-reverse" : "justify-start"}`}>
              <div className={`flex gap-1 items-center ${message.sender.id === userId ? "flex-row-reverse" : "justify-start"}`}>
                <Avatar size="sm" src={message.sender.id === userId ? message.sender.avatar : null} alt={message.sender.username} />
                <Text size="xs">{message.sender.id === userId ? "You" : "Admin" }</Text>
              </div>
              <div>
                <Text c="dimmed" classNames={{ root: "text-[10px]" }}>{new Date(message.timeStamp).toLocaleTimeString()}</Text>
              </div>
            </div>
            <div className={`break-words text-wrap border p-2 rounded-lg ${message.sender.id === userId ? "bg-primary text-white self-end" : "bg-white text-black self-start" }`}>
              <Text>{message.content}</Text>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
