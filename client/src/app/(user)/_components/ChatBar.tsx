'use client'

import { Connection } from '@/components/ChatProvider'
import React, { useContext, useEffect, useState } from 'react'
import ChatChip from './ChatChip'
import { Button, TextInput } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'

export default function ChatBar() {
  const socket = useContext(Connection)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)
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
      const onConnect = () => {
        console.log('connect', socket.id)
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
  }, [socket])
  return (
    <>
      {isLoading ? null : (
        <div className="bg-white p-0 m-0 hidden md:block fixed bottom-0 right-0 w-[20em] border border-gray-300">
          <div
            className="flex align-middle justify-center cursor-pointer border-gray-300 shadow-sm"
            onClick={toggleChat}
          >
            <p>Chat with admin</p>
          </div>
          {!isOpened ? null : (
            <>
              <div className="flex gap-3 flex-col h-[20em] px-5 overflow-y-scroll bg-gray-200">
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
              </div>
              <div className="flex flex-row w">
                <TextInput classNames={{ root: 'w-full' }} />
                <Button>
                  <IconSend />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
