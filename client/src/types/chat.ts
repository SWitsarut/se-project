import { Role } from '@prisma/client'

export type sendingMSG = {
  content: string | undefined
  sender: string | undefined
  receiver: string | undefined
}

// Type '{ id: string; username: string; displayName: string; avatar: string | null; role: Role; } | null'
//  is not assignable to type 'UserMsg | undefined'.
//   Type 'null' is not assignable to type 'UserMsg | undefined'.ts(2322)

export type UserMsg = {
  id: string
  username: string
  displayName: string
  avatar: string | null
  role: Role
}
