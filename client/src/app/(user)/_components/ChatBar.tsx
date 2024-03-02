'use client'

import { Connection } from '@/components/ChatProvider'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatChip from './ChatChip'
import { Button, TextInput } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'

export default function ChatBar() {
  const socket = useContext(Connection)
  const sessoin = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const text = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const lsOpened = localStorage.getItem('chat-open')
    if (lsOpened == undefined || lsOpened == null) {
      localStorage.setItem('chat-open', 'false')
    }
    setIsOpened(Boolean(lsOpened))
    setIsLoading(false)
  }, [])

  const toggleChat = () => {
    setIsOpened((prev) => {
      const newState = !prev
      localStorage.setItem('chat-open', String(newState))
      return newState
    })
  }
  useEffect(() => {
    if (socket) {
      const onConnect = async () => {
        console.log('connect', socket.id)
        const res = await fetch('http://localhost:3000/api/updateSession', {
          method: 'POST',
          body: JSON.stringify({
            userId: sessoin.data?.user.id,
            session: socket.id,
          }),
        })
      }
      const receive = (msg: string) => {
        console.log(msg)
      }
      socket.on('connect', onConnect)
      socket.on('receive-message', receive)
      return () => {
        socket.off('receive-message', receive)
        socket.off('connect', onConnect)
      }
    }
  }, [socket,sessoin])
  return (
    <>
      {isLoading ? null : (
        <div className="bg-white p-0 m-0 mr-4 hidden md:block fixed bottom-0 right-0 w-[20em] border border-gray-300">
          <div
            className="flex align-middle justify-center cursor-pointer border-gray-300 shadow-sm"
            onClick={toggleChat}
          >
            <p>Chat with admin</p>
          </div>
          {!isOpened ? null : (
            <>
              <div className="flex gap-3 flex-col h-[20em] px-5 overflow-y-scroll bg-gray-200 py-3">
                <ChatChip
                  message={{
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
                  }}
                />
                <ChatChip
                  message={{
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
                  }}
                />
                <ChatChip
                  message={{
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
                  }}
                />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert(text.current?.value)
                }}
                className="flex flex-row w"
              >
                <TextInput ref={text} classNames={{ root: 'w-full' }} />
                <Button type="submit">
                  <IconSend />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
