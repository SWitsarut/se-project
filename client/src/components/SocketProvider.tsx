"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const socket = io("http://localhost:8080/");

interface SocketProviderProps {
  children?: React.ReactNode
}

interface ISocketContext {
  sendMessage: (serverId: string, roomId: string, msg: string) => any
  createRoom: (serverId: string) => any
  socket: Socket
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);

  if(!state) throw new Error("state is undefine");

  return state;
}

export default function SocketProvider({children}: SocketProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const sendMessage: ISocketContext['sendMessage'] = useCallback((serverId, roomId, msg) => {
    socket.emit("message", { serverId, roomId, msg })
  }, []);

  const createRoom: ISocketContext['createRoom'] = useCallback((serverId) => {
    socket.emit("create-room", serverId)
  }, [])

  useEffect(() => {
    socket.connect();
    socket.on("receive-message", () => router.refresh());
    socket.on("updated-room", () => router.refresh())

    return () => {
      socket.off("receive-message", () => router.refresh());
      socket.off("updated-room", () => router.refresh())
      socket.disconnect();
    }
  }, [pathname])

  return (
    <SocketContext.Provider value={{ socket ,sendMessage, createRoom }}>
      {children}
    </SocketContext.Provider>
  )
}
