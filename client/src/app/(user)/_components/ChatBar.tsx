'use client'

import { Connection } from '@/components/ChatProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatChip from './ChatChip'
import { Button, TextInput } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { message } from '@/types/message'
import { User } from '@/types/user'
import { Session } from 'next-auth'
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

export default function ChatBar({ initmsg }: { initmsg: message[] }) {
  const session = useSession()
  const socket = useContext(Connection)

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [sendtarget, setSendTarget] = useState<string | undefined>(
    '0ba61313-9640-4712-bb96-e289f890de96',
  )

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const text = useRef<HTMLInputElement | null>(null)

  const [msgs, setMsgs] = useState<message[]>(initmsg)

  useEffect(() => {
    console.log(session)
  }, [session])

  useEffect(() => {
    if (
      session.status == 'authenticated' &&
      initmsg.length != 0 &&
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
  }, [initmsg.length, isConnected, session, socket])

  function sendMSG() {
    if (!sendtarget && msgs.length == 0) {
      if (!isConnected) {
        socket?.connect()
      }
    }
    const content = text.current?.value
    const msg: sendingMSG = {
      content: content || '',
      sender: session.data?.user.id,
      receiver: sendtarget,
    }
    socket?.emit('message', JSON.stringify(msg))
  }

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

      const sended = (id: string) => {
        console.log(id)
      }

      const assignAdmin = async () => {}

      const receive = (msg: string) => {
        console.log(msg)
      }
      const disConnect = async () => {
        await fetch(`/api/chat/endSession`, {
          method: 'POST',
          body: JSON.stringify({ id: session.data?.user.id }),
        })
      }
      socket.on('connect', onConnect)
      socket.on('disconnect', disConnect)
      socket.on('receive-message', receive)
      socket.on('sended', sended)
      socket.on('assign-admin', receive)
      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', disConnect)
        socket.off('receive-message', receive)
        socket.on('sended', sended)
        socket.off('assign-admin', assignAdmin)
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
                {msgs?.map((element) => {
                  return <ChatChip key={element.id} message={element} />
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
                  sendMSG()
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
