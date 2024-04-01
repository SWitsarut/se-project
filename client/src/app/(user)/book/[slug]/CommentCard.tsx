"use client";

import { CommentType } from "@/types/book"
import { formatDateToAgo } from "@/utils"
import { Rating, Text } from "@mantine/core"
import { Avatar } from "@mantine/core"

interface CommentCardProps {
  data: CommentType,
}

export default function CommentCard({ data }: CommentCardProps) {
  return (
    <div className="p-4 shadow-md rounded-lg border flex flex-col gap-4 relative">
      <div className="flex items-center gap-4">
        <Avatar src={data.user.avatar} alt={data.user.username} />
        <div className="flex flex-col gap-1">
          <Text>{data.user.displayName} <Text c="dimmed" span size="xs">({formatDateToAgo(new Date(data.createdAt))})</Text></Text>
          <Rating fractions={2} value={data.rating} readOnly/>
        </div>
      </div>
      <div className="break-words">
        <Text>{data.content}</Text>
      </div>
    </div>
  )
}
