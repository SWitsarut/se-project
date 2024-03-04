import prisma from '@/libs/prisma'

async function sessionEnd(id: string) {
  await prisma.userSession.update({ where: { id }, data: { sessionId: '' } })
}

export async function GET(req: Request) {}
