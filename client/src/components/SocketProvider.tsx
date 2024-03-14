"use client";

import { MessageData } from "@/types/message";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const { data: session } = useSession();

  const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
    socket.emit("message", msg);
  }, []);

  useEffect(() => {
    if(session) {
      socket.auth = { userInfo: session.user };
      if(session.user.role === "ADMIN") {
        socket.connect();
      }
      socket.on("receive-message", (messageData: MessageData) => {
        router.refresh()
        if(messageData.senderId !== session.user.id) {
          notifications.show({ title: "New message", message: messageData.content })
        }
      });

      return () => {
        socket.off("receive-message", () => router.refresh());
        socket.disconnect();
      }
    }
  }, [pathname])

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}
