import prisma from '@/libs/prisma'
import AdminChat from './AdminChat'

export default async function page() {
  const users = await prisma.chatMessage.findMany({
    where: {
      senderData: {
        role: {
          not: 'ADMIN',
        },
      },
    },
    orderBy: {
      timeStamp: 'desc',
    },
    include: {
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
    distinct: ['sender'],
  })

  const modifiedUsers = users.map((user) => ({
    ...user,
    ...user.senderData,
    senderData: undefined,
    counter: 0,
  }))

  // console.log('users', 1modifiedUsers)
  return (
    <>
      <AdminChat users={modifiedUsers} />
    </>
  )
}
