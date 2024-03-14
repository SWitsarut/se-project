"use client"

import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useSocket } from "../SocketProvider";
import { BASE_URL } from "@/utils";
import { useRouter } from "next/navigation";

interface MessageInputProps {
  senderId: string | undefined
  handleSubmit: (message: string) => void
}

export default function MessageInput({ senderId, handleSubmit }: MessageInputProps) {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(socket) {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: message, senderId })
      })
  
      const data = await res.json();
      console.log(data);
  
      handleSubmit(message);
    }
  }

  return (
    <form onSubmit={sendMessage}>
      <TextInput value={message} onChange={(e) => setMessage(e.target.value)}/>
      <Button type="submit">Send</Button>
    </form>
  )
}
