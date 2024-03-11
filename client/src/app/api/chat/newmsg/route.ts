import prisma from '@/libs/prisma'
import { UserMsg } from '@/types/chat'
import { message } from '@/types/message'
import { NextResponse } from 'next/server'

async function getUserData(userID: string) {
  const user: UserMsg | null = await prisma.user.findFirst({
    where: { id: userID },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      role: true,
    },
  })
  return user
}

export const POST = async (req: Request) => {
  const msg = await req.json()

  if (
    msg.content == undefined ||
    msg.sender == undefined ||
    msg.receiver == undefined
  ) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const sender: string = msg.sender
  const receiver: string = msg.receiver
  const res = await prisma.chatMessage.create({
    data: {
      content: msg?.content,
      sender: msg?.sender,
      receiver: msg?.receiver,
    },
  })
  const senderData = await getUserData(msg.sender)
  const receiverData = await getUserData(msg.receiver)
  const sendTo = msg?.receiver
  const to = await prisma.userSession.findFirst({
    where: { id: sendTo },
    select: { sessionId: true },
  })
  // console.log('user id sendTo =', sendTo, 'with', to)
  const message: message = {
    content: res.content,
    sender: sender,
    receiver: receiver,
    senderData,
    receiverData,
  }
  return NextResponse.json({ id: res.id, message, to }, { status: 200 })
}
