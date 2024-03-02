'use client'
import { useSession } from 'next-auth/react'
import React, { createContext, useRef } from 'react'
import { Socket, io } from 'socket.io-client'
import { Notification } from '@mantine/core'

const Connection = createContext<Socket | undefined | null>(undefined)
export default function ChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const socket = useRef<Socket | null>()
  const { data: session } = useSession()
  socket.current = io('localhost:8080', { autoConnect: false })
  socket.current.auth = { userInfo: session?.user }
  socket.current.connect()

  return (
    <Connection.Provider value={socket.current}>{children}</Connection.Provider>
  )
}
export { Connection }
