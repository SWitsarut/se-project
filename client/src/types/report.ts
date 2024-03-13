export type Report = {
  id: number
  username: string
  avatar: string | null
  role: string
  reason: string
  status: string
  createAt: Date
}

export interface ReportFormType {
  userId: string
  isbn: string
  reason: string
}