import Navbar from '@/components/Navbar'
import ChatBar from './_components/ChatBar'
import { message } from '@/types/message'
import { getCurrentSession } from '@/libs/getCurrentSession'
import { getCurrentUser } from '@/libs/getCurrentUser'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const {data:session} =useSession()
  const session = await getCurrentSession()
  if (!session) {
    return (
      <>
        <Navbar />
        <div className="py-16 px-0 md:px-24">{children}</div>
      </>
    )
  }
  const initmsg: message[] = [
    {
      id: '1',
      receiver: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: '8retid8',
        email: 'nitid1987@gmail.com',
        id: 'sex slave',
        isActive: true,
        publisherName: undefined,
        role: 'ADMIN',
        username: '',
      },
      sender: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: '8retid8',
        email: 'nitid1987@gmail.com',
        id: 'gundam lover',
        isActive: true,
        publisherName: undefined,
        role: 'USER',
        username: '',
      },
      content:
        'キミにFall in love 恋のSOS ずっと胸が苦しいんです ハヤクRescue 「好き」のテレパシーに早く気づいて！',
    },
    {
      id: '2',
      receiver: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: '8retid8',
        email: 'nitid1987@gmail.com',
        id: 'sex slave',
        isActive: true,
        publisherName: undefined,
        role: 'USER',
        username: '',
      },
      sender: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: 'get your ass back here',
        email: 'nitid1987@gmail.com',
        id: 'gundam Lover',
        isActive: true,
        publisherName: undefined,
        role: 'ADMIN',
        username: '',
      },
      content:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum vel natus commodi debitis, cum laborum veritatis libero illo beatae fuga reiciendis culpa vitae quam! Fuga dolor quisquam rem, sint vitae distinctio officiis consequuntur a iure voluptatibus ducimus molestiae alias asperiores libero facilis, ratione laboriosam eveniet numquam nihil autem! At veniam quas eaque numquam, deleniti unde eum quasi labore, excepturi error minima molestiae. Iste sunt animi nulla culpa adipisci temporibus optio enim nostrum, quam, cupiditate fugit iusto maiores aperiam voluptates soluta dolor exercitationem inventore? Praesentium ab eos tempore recusandae ea doloremque hic repudiandae aspernatur placeat quam porro ipsam, culpa ipsum sit.',
    },
    {
      id: '3',
      receiver: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: '8retid8',
        email: 'nitid1987@gmail.com',
        id: 'sex slave',
        isActive: true,
        publisherName: undefined,
        role: 'USER',
        username: '',
      },
      sender: {
        avatar:
          'http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn-local.mebmarket.com%2Fmeb%2Fserver1%2F265529%2FThumbnail%2Fbook_detail_large.gif%3F2&w=828&q=75',
        displayName: '8retid8',
        email: 'nitid1987@gmail.com',
        id: 'sex slave',
        isActive: true,
        publisherName: undefined,
        role: 'ADMIN',
        username: '',
      },
      content: 'hello from admin',
    },
  ]

  return (
    <>
      <Navbar />
      <div className="py-16 px-0 md:px-24">{children}</div>
      <ChatBar initmsg={initmsg} />
    </>
  )
}
