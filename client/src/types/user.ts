import { PaymentStatus } from "@prisma/client"

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

export interface OrderHistoryData {
  id: number
  paidAt: Date | null
  status: PaymentStatus
  order: {
    bookIsbn: string
    bookTitle: string
    bookPrice: number
  }[]
}