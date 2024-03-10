import { UserMsg } from '@/types/chat'
import AdminChat from './AdminChat'
import prisma from '@/libs/prisma'

export default async function page() {
  // const users = await prisma.chatMessage.findMany({
  //   where: {
  //     senderData: {
  //       role: {
  //         not: 'ADMIN',
  //       },
  //     },
  //   },
  //   include: {
  //     senderData: {
  //       select: {
  //         id: true,
  //         username: true,
  //         displayName: true,
  //         avatar: true,
  //         role: true,
  //       },
  //     },
  //   },
  // })

  // const existingIds = new Set()
  // const filteredUsers = users.filter((user) => {
  //   if (existingIds.has(user.senderData.id)) {
  //     return false
  //   } else {
  //     existingIds.add(user.senderData.id)
  //     return true
  //   }
  // })

  // const modifiedUsers = filteredUsers.map((user) => ({
  //   ...user,
  //   ...user.senderData,
  //   senderData: undefined,
  // }))

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
