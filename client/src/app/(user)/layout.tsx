import Navbar from '@/components/Navbar'
import ChatBar from './_components/ChatBar'
import { message } from '@/types/message'
import { getCurrentSession } from '@/libs/getCurrentSession'
import { getCurrentUser } from '@/libs/getCurrentUser'
import prisma from '@/libs/prisma'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const {data:session} =useSession()
  const session = await getCurrentSession()

  // const initmsg = await prisma.chatMessage.findMany({
  //   where: { receiver: session?.user.id },
  // })
  const initmsg: [] = []

  const admin = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/chat/requestAdmin`,
  ).then((e) => e.json())

  return (
    <>
      <Navbar />
      <div className="py-16 px-0 md:px-24">{children}</div>
      <ChatBar initmsg={initmsg} target={admin.id} />
    </>
  )
}
