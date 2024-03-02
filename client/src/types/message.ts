import { User } from './user'
export type message = {
  sender: User | 'admin'
  receiver: User | 'admin'
  content: string
}
