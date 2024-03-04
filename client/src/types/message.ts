import { User } from './user'

export type message = {
  id?: string
  sender: User | undefined
  receiver: User | undefined
  content: string
}
