'use client'
import { useSession } from 'next-auth/react'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

const Connection = createContext<Socket | undefined>(undefined)

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()
  const socketRef = useRef<Socket | null>(null)
  socketRef.current = io('localhost:8080', {
    autoConnect: false,
    auth: {
      userinfo: session.data,
    },
  })
  return (
    <Connection.Provider value={socketRef.current}>
      {children}
    </Connection.Provider>
  )
}

export { Connection }
