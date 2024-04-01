"use client";

import { useSocket } from '@/components/SocketProvider';
import { Button, TextInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MessageInputProps {
  senderId: string
  receiverId: string
}

export default function MessageInput({ senderId, receiverId }: MessageInputProps) {
  const { sendMessage } = useSocket();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, senderId, receiverId  })
    });
    
    const data = await res.json();

    sendMessage({ content, senderId, receiverId});
    setContent("");
    setIsLoading(false);
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <TextInput classNames={{ root: "w-full" }} value={content} onChange={(e) => setContent(e.currentTarget.value)}/>
      <Button loading={isLoading} type='submit'>Send</Button>
    </form>
  )
}
