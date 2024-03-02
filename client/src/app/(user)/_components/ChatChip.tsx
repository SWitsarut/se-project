'use client'
import { message } from '@/types/message'
import { Avatar } from '@mantine/core'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function ChatChip({ message }: { message: message }) {
  const currentUser = useSession()
  return (
    <>
      <div className="flex flex-row gap-2 text-center w-auto">
        <Avatar src={currentUser.data?.user.image} alt="it's me" />
        <div
          className={`px-3 flex w-full ${message.sender == 'admin' ? 'bg-white' : 'bg-blue-400'}`}
        >
          {message.content}
        </div>
        
      </div>
    </>
  )
}
