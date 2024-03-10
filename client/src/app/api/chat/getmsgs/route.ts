import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
  const { user } = await req.json()
  const msgs = await prisma.chatMessage.findMany({
    where: {
      OR: [{ sender: user }, { receiver: user }],
    },
    include: {
      receiverData: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
        },
      },
      senderData: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
        },
      },
    },
  })
  return NextResponse.json(msgs, { status: 200 })
}
