import prisma from '@/libs/prisma'
import { User } from '@prisma/client'

function selectOneAdmin(admins: User[]) {
  const randomIndex = Math.floor(Math.random() * admins.length)
  return admins[randomIndex]
}

export async function GET() {
  prisma.userSession.findMany({ where: { user: { role: 'ADMIN' } } })
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  const admin = selectOneAdmin(admins)
  return admin
}
