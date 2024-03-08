import { UserMsg } from './chat'
import { User } from './user'

export interface message {
  id?: string
  sender: string | null
  receiver: string | null
  senderData: UserMsg | null
  receiverData: UserMsg | null
  content: string
}
