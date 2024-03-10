import { UserMsg } from '@/types/chat'
import { Avatar, Divider } from '@mantine/core'
import React, { useState } from 'react'

export default function UserChip({
  user,
  onClick,
}: {
  user: UserMsg
  onClick?: () => void
}) {
  return (
    <div
      className="  hover:cursor-pointer p-2 border border-gray-300"
      onClick={onClick}
    >
      <div className="flex flex-row gap-3">
        <Avatar src={user.avatar} alt={user.username} />
        <p>{user.displayName}</p>
      </div>
      <div></div>
    </div>
  )
}
