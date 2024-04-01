export interface MessageData {
  senderId: string
  receiverId?: string
  content: string
}

export interface ChatHistoryData {
  id: number
  content: string
  timeStamp: Date
  sender: {
    id: string
    username: string
    displayName: string
    avatar: string | null
  }
  receiver: {
    id?: string
    username?: string
    displayName?: string
    avatar?: string | null
  }
}