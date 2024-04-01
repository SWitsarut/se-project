import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import { getCurrentSession } from '@/libs/getCurrentSession'
import prisma from '@/libs/prisma'
import ChatBar from './_components/ChatBar'
import { message } from '@/types/message'


export default async function MainLayout({ children }: {
  children: React.ReactNode
}) {

  const session = await getCurrentSession()

  const initmsg: message[] = await prisma.chatMessage.findMany({
    orderBy: {
      timeStamp: 'asc',
    },
    where: {
      OR: [{ sender: session?.user.id }, { receiver: session?.user.id }],
    },
    include: {
      receiverData: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
        },
      },
      senderData: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
        },
      },
    },
  })

  const admin = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/chat/requestAdmin`,
  ).then((e) => e.json())


  return (
    <>
      <Navbar />
      <CartProvider>
      <div className="py-16 px-0 md:px-24">{children}</div>
      </CartProvider>
      {session?.user.role == 'USER' ? (
        <ChatBar initmsg={initmsg} target={admin.id} />
      ) : null}
    </>
  )
}