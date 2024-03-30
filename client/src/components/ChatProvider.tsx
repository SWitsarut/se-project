'use client'
import { message } from '@/types/message'
import { Notification } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useSession } from 'next-auth/react'
import React, { createContext, use, useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

const Connection = createContext<Socket | undefined>(undefined)

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()
  const socketRef = useRef<Socket | null>(null)
  // const chaturl: string = process.env.CHAT_PUBLIC_URL || ''
  socketRef.current = io(`localhost:8080`, {
    autoConnect: false,
    auth: {
      userinfo: session.data,
    },
  })
  useEffect(() => {
    const onConnect = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/updateSession`,
        {
          method: 'POST',
          body: JSON.stringify({
            id: session?.data?.user.id,
            session: socketRef.current?.id,
          }),
        },
      ).then((data) => data.json())
      console.log('connected to socket with sessionId', res)
    }
    const receive = (msg: message) => {
      console.log('notify receive', msg)
      notifications.show({
        title: msg.senderData?.displayName,
        message: msg.content,
        autoClose: 2500,
      })
    }
    if (session.data?.user.role == 'ADMIN') {
      socketRef.current?.on('connect', onConnect)
      socketRef.current?.on('receive-message', receive)
      socketRef.current?.connect()
    }

    return () => {
      if (session.data?.user.role == 'ADMIN') {
        socketRef.current?.off('connect', onConnect)
        socketRef.current?.off('receive-message', receive)
      }
    }
  }, [session.data?.user.id, session.data?.user.role])

  return (
    <>
      <Connection.Provider value={socketRef.current}>
        {children}
      </Connection.Provider>
    </>
  )
}

export { Connection }
