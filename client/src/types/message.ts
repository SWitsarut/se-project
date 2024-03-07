import { UserMsg } from './chat'
import { User } from './user'

export type message = {
  id?: string
  sender: UserMsg | null
  receiver: UserMsg | null
  content: string
}
