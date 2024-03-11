import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

function selectOneAdmin(
  admins: {
    id: string
  }[],
) {
  const randomIndex = Math.floor(Math.random() * admins.length)
  return admins[randomIndex]
}

export async function GET() {
  // prisma.userSession.findMany({ where: { user: { role: 'ADMIN' } } })
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  })
  console.log('admins', admins)
  const admin = selectOneAdmin(admins)
  return NextResponse.json(admin, { status: 200 })
}
