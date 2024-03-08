'use client'
import { message } from '@/types/message'
import { Avatar } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function ChatChip({ message }: { message: message }) {
  const adminSend = message.senderData?.role == 'ADMIN'
  return (
    <div className="flex flex-col">
      <span
        className={`text-[0.75em] text-gray-500 ${adminSend ? null : 'text-right'}`}
      >
        {message.senderData?.displayName}
      </span>
      <div
        className={`${adminSend ? 'flex-row' : 'flex-row-reverse'} flex  gap-2 w-auto`}
      >
        <Avatar
          classNames={{ root: 'shadow-sm' }}
          src={message.senderData?.avatar}
          alt={message.senderData?.displayName}
        />
        <div
          className={`px-3 py-2 flex rounded-lg border-gray-600 shadow-sm ${adminSend ? 'bg-white' : 'bg-blue-400'}`}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
