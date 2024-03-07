import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

async function findExistUsersChat(id: string) {
  const found: boolean =
    (await prisma.userSession.findFirst({ where: { id } })) != null
  return found
}

async function addNewUserSession(id: string, session: string) {
  const res = await prisma.userSession.create({
    data: { id, sessionId: session },
  })
  console.log('insert val', res)
  return res
}

export const POST = async (req: Request) => {
  const { id, session } = await req.json()
  const found = await findExistUsersChat(id)
  console.log('found', found)
  console.log(session)
  if (!found) {
    await addNewUserSession(id, session)
  } else {
    await prisma.userSession.update({
      where: { id },
      data: { sessionId: session },
    })
  }
  return NextResponse.json({ session }, { status: 200 })
}
