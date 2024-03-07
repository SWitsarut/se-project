export type User = {
  id: string
  username: string
  email: string | undefined | null
  displayName: string
  avatar: string | null
  isActive: boolean
  role: string
  publisherName: string | undefined
}
