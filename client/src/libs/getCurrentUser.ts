import { User } from '@/types/user'
import prisma from './prisma'

export async function getCurrentUser(id: string) {
  const res = await prisma.user.findUnique({
    where: { id },
    include: {
      publisher: true,
    },
  })
  if (!res) {
    return undefined
  }
  const user: User = {
    id: res?.id,
    username: res?.username,
    displayName: res?.displayName,
    email: res?.email,
    avatar: res?.avatar,
    role: res?.role,
    isActive: res?.isActive,
    publisherName: res?.publisher?.publisherName,
  }
  return user
}
