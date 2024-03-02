'use client'
import { message } from '@/types/message'
import { Avatar } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function ChatChip({ message }: { message: message }) {
  const adminSend = message.sender.role == 'ADMIN'
  return (
    <>
      <div
        className={`${adminSend ? 'flex-row' : 'flex-row-reverse'} flex  gap-2 text-center w-auto`}
      >
        <Avatar src={message.sender.avatar} alt={message.sender.displayName} />
        <div
          className={`px-3 py-2 flex w-full ${adminSend ? 'bg-white' : 'bg-blue-400'}`}
        >
          {message.content}
        </div>
      </div>
    </>
  )
}
