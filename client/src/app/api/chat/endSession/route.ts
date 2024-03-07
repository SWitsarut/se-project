import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

async function sessionEnd(id: string) {
  return await prisma.userSession.update({
    where: { id },
    data: { sessionId: '' },
  })
}

export async function POST(req: Request) {
  const { id } = await req.json()
  const res = await sessionEnd(id)
  return NextResponse.json({ res }, { status: 200 })
}
