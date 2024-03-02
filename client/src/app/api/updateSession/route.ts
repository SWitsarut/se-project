import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

function postNewRecord() {}

function updateRecord() {}

export const POST = async (req: Request) => {
  const { id, session } = await req.json()
  const found = (await prisma.userSession.findFirst({ where: { id } })) != null
  if (!found) {
  }

  return NextResponse.json({ session }, { status: 200 })
}
