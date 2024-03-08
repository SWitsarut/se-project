import { string } from "zod"

export type Report = {
  id: number
  username: string
  avatar: string | null
  role: string
  reason: string
  status: string
  createAt: string
}

export interface ReportFormType {
  userId: string
  isbn: string
  reason: string
}