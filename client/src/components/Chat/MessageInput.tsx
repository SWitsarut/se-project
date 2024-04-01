"use client"

import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useSocket } from "../SocketProvider";
import { MessageData } from "@/types/message";

interface MessageInputProps {
  senderId: string
  handleSubmit: (messageData: MessageData) => void
}

export default function MessageInput({ senderId, handleSubmit }: MessageInputProps) {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if(socket) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: message, senderId })
      })
  
      const data = await res.json();
      console.log(data);
  
      handleSubmit({ content: message, senderId });
      setMessage("");
    }
    setIsLoading(false);
  }

  return (
    <form className="flex gap-2 p-2" onSubmit={sendMessage}>
      <TextInput value={message} onChange={(e) => setMessage(e.target.value)}/>
      <Button loading={isLoading} type="submit">Send</Button>
    </form>
  )
}
