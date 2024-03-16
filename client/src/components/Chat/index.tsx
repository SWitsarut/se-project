"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/utils";
import { useSocket } from "../SocketProvider";
import MessageInput from "./MessageInput";
import MessageContent from "./MessageContent";
import { MessageData } from "@/types/message";
import { notifications } from "@mantine/notifications";

export default function Chat() {
  const { data: session, status } = useSession();
  const { sendMessage, socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const fetchMessages = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/chat/${session?.user.id}`);
    const data = await res.json();
    setMessages(data);
  }, [session]);

  const handleSubmit = useCallback(async (messageData: MessageData) => {
    if(session) {
      sendMessage({ content: messageData.content, senderId: messageData.senderId });
      fetchMessages(); 
    }
  }, [session, sendMessage, fetchMessages])

  useEffect(() => {
    if(session && isOpen && socket) {
      const onReceiveMessage = (messageData: MessageData) => {
        fetchMessages();
        if(messageData.senderId !== session.user.id) {
          notifications.show({ title: "New message", message: messageData.content })
        }
      }

      socket.on("receive-message", onReceiveMessage);

      return () => {
        socket.off("receive-message", onReceiveMessage);
      }
    }
  }, [isOpen, session, socket, fetchMessages])

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages])

  return (
    <>
      {status !== "loading" && status !== "unauthenticated" && session && (
        <div className="fixed bottom-0 right-10 border p-6">
          <div onClick={() => setIsOpen((prevState) => !prevState)}>
            Chat with admin
          </div>
          {isOpen && (
            <>
              <MessageContent userId={session.user.id} messages={messages}/>
              <MessageInput handleSubmit={handleSubmit} senderId={session.user.id}/>
            </>
          )}
        </div>
      )}
    </>
  )
}
