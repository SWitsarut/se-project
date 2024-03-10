import { Role } from '@prisma/client'

export type sendingMSG = {
  content: string | undefined
  sender: string | undefined
  receiver: string | undefined
}

export type UserMsg = {
  id: string
  username: string
  displayName: string
  avatar: string | null
  role: Role
}
export type AdminMsg = {
  id: string
  username: string
  displayName: string
  avatar: string | null
  role: Role
  counter: number
}
