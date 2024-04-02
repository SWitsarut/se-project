"use client";

import { MessageData } from "@/types/message";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  autoConnect: false
});

interface SocketProviderProps {
  children: React.ReactNode
}

interface ISocketContext {
  sendMessage: (messageData: MessageData) => any
  socket: Socket | null
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);

  if(!state) throw new Error("state is undefine");

  return state;
}

export default function SocketProvider({children}: SocketProviderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const sendMessage: ISocketContext["sendMessage"] = useCallback((messageData) => {
    if(session) {
      socket.emit("message", messageData);
      router.refresh();
    } 
  }, []);

  useEffect(() => {
    if(session) {
      socket.auth = { userInfo: session.user };
      socket.connect();

      const onReceiveMessage = (messageData: MessageData) => {
        if(messageData.senderId !== session.user.id && session.user.role === "ADMIN") {
          notifications.show({ title: "New message", message: messageData.content })
        }
        router.refresh();
      }

      if(session.user.role === "ADMIN") {
        socket.on("receive-message", onReceiveMessage);
      }

      return () => {
        socket.off("receive-message", onReceiveMessage);
        socket.disconnect();
      }
    }
  }, [router, session])

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
