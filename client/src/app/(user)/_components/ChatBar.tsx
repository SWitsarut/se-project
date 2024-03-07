'use client'

import { Connection } from '@/components/ChatProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatChip from './ChatChip'
import { Button, TextInput } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { message } from '@/types/message'
import { sendingMSG } from '@/types/chat'

// function session2user(session: any): User {
//   const { user } = session
//   const converted: User = {
//     id: user.id,
//     avatar: user.avatar,
//     displayName: user.displayName,
//     email: user.email,
//     isActive: true,
//     role: user.role,
//     username: user.username,
//     publisherName: undefined,
//   }
//   return converted
// }

export default function ChatBar({
  initmsg,
  target,
}: {
  initmsg: message[] | []
  target: string
}) {
  const session = useSession()
  const socket = useContext(Connection)

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const sendtaget = useRef<string>(target)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const [text, setText] = useState<string>('')

  const [msgs, setMsgs] = useState<message[] | []>(initmsg)

  useEffect(() => {
    if (
      session.status == 'authenticated' &&
      initmsg?.length != 0 &&
      !isConnected
    ) {
      socket?.connect()
    }
    const lsOpened = localStorage.getItem('chat-open')
    if (lsOpened == undefined || lsOpened == null) {
      localStorage.setItem('chat-open', 'false')
    }
    setIsOpened(Boolean(lsOpened))
    setIsLoading(false)
  }, [initmsg?.length, isConnected, session, socket])

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/chat/updateSession`,
          {
            method: 'POST',
            body: JSON.stringify({
              id: session?.data?.user.id,
              session: socket.id,
            }),
          },
        ).then((data) => data.json())
        setIsConnected(true)
        console.log(res)
      }

      const sended = async (confirm: string) => {
        const { id, msg } = await JSON.parse(confirm)
        console.log('sended', id)
        setMsgs((prev) => {
          return [...prev, msg]
        })
      }

      const receive = async (msg: message) => {
        console.log(msg)
        setMsgs((prev) => {
          return [...prev, msg]
        })
      }

      socket.on('connect', onConnect)
      socket.on('receive-message', receive)
      socket.on('sended', sended)
      return () => {
        socket.off('connect', onConnect)
        socket.off('receive-message', receive)
        socket.on('sended', sended)
      }
    }
  }, [socket, session])
  return (
    <>
      {isLoading || session.status == 'unauthenticated' ? null : (
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
                {msgs?.map((element, index) => {
                  return <ChatChip key={index} message={element} />
                })}
              </div>
              <Button
                onClick={() => {
                  socket?.connect()
                }}
              >
                Con
              </Button>
              <Button
                onClick={() => {
                  socket?.disconnect()
                }}
              >
                Dis
              </Button>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const msg: sendingMSG = {
                    content: text,
                    sender: session.data?.user.id,
                    receiver: target,
                  }
                  socket?.emit('message', JSON.stringify(msg))
                  setText('')
                }}
                className="flex flex-row w"
              >
                <TextInput
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  classNames={{ root: 'w-full' }}
                />
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
