"use client";

import { useSocket } from '@/components/SocketProvider';
import { BASE_URL } from '@/utils';
import { Button, TextInput } from '@mantine/core';
import { useState } from 'react';

interface MessageInputProps {
  senderId: string
  receiverId: string
}

export default function MessageInput({ senderId, receiverId }: MessageInputProps) {
  const { sendMessage } = useSocket();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, senderId, receiverId  })
    })

    const data = await res.json();
    console.log(data);

    sendMessage({ content, senderId });
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput value={content} onChange={(e) => setContent(e.currentTarget.value)}/>
      <Button type='submit'>Send</Button>
    </form>
  )
}
