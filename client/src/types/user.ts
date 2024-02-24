import { Role } from "@prisma/client"

export type User = {
  id: string
  username: string
  email: string
  displayName: string
  avatar: string | null
  isActive: boolean
  role: string
  publisherName: string | undefined
}