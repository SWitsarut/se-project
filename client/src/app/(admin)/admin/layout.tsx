import Sidebar from '@/components/Sidebar'
import { getCurrentSession } from '@/libs/getCurrentSession'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentSession()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return <Sidebar>{children}</Sidebar>
}
