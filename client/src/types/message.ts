import { User } from './user'

export type message = {
  sender: User
  receiver: User
  content: string
}
