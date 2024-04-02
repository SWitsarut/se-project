"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../SocketProvider";
import MessageInput from "./MessageInput";
import MessageContent from "./MessageContent";
import { ChatHistoryData, MessageData } from "@/types/message";
import { notifications } from "@mantine/notifications";
import { Loader, Text } from "@mantine/core";

export default function Chat() {
  const { data: session, status } = useSession();
  const { sendMessage, socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatHistoryData[]>([]);
  
  const fetchMessages = useCallback(async () => {
    if(session) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat/${session.user.id}`);
      const data = await res.json();
      setMessages(data);
    }
  }, [session]);

  const handleSubmit = useCallback(async (messageData: MessageData) => {
    if(session && socket) {
      socket.emit("message", messageData);
      fetchMessages();
    }
  }, [session, fetchMessages, socket])

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
    if(isOpen) {
      setIsLoading(true);
      fetchMessages().then(() => setIsLoading(false));
    }
  }, [fetchMessages, isOpen])

  return (
    <>
      {status !== "loading" && status !== "unauthenticated" && session && session.user.role !== "ADMIN" && (
        <div className="fixed -bottom-1 right-10 border-2 w-72 z-50 rounded-t-xl overflow-hidden shadow-md">
          <div
            onClick={() => setIsOpen((prevState) => !prevState)}
            className="bg-primary text-white px-6 py-4 w-full"
          >
            <Text size="sm" fw={500}>
              Chat with admin
            </Text>
          </div>
          {isOpen && (
            <div className="flex flex-col gap-2 w-full relative break-words bg-white">
              {isLoading ? (
                <div className="flex p-4 justify-center">
                  <Loader />
                </div>
              ) : (
                <MessageContent userId={session.user.id} messages={messages}/>
              )}
              <MessageInput handleSubmit={handleSubmit} senderId={session.user.id}/>
            </div>
          )}
        </div>
      )}
    </>
  )
}
