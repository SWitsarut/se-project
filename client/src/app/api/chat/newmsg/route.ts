import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const { id, session } = await req.json()
  const found = await prisma.userSession.findFirst({ where: { id } })

  return NextResponse.json({ text: 'hi' })
}
