'use client'

import { Connection } from '@/components/ChatProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import ChatChip from './ChatChip'
import { Button, TextInput } from '@mantine/core'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { message } from '@/types/message'
import { User } from '@/types/user'

export default function ChatBar({ initmsg }: { initmsg: message[] }) {
  const { data: session, status } = useSession()
  const socket = useContext(Connection)

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [sendtarget, setSendTarget] = useState<User | undefined>(undefined)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpened, setIsOpened] = useState<boolean>(false)

  const text = useRef<HTMLInputElement | null>(null)

  const [msgs, setMsgs] = useState<message[]>(initmsg)

  useEffect(() => {
    console.log(status)
  }, [status])

  useEffect(() => {
    if (initmsg.length != 0 && !isConnected) {
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
    // const msg: message = {
    //   content: content || '',
    //   sender: session?.user,
    //   receiver: sendtarget || undefined,
    // }
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
              id: session?.user.id,
              session: socket.id,
            }),
          },
        ).then((data) => data.json())
        setIsConnected(true)
        console.log(res)
      }

      const assignAdmin = async () => {}

      const receive = (msg: string) => {
        console.log(msg)
      }
      socket.on('connect', onConnect)
      socket.on('receive-message', receive)
      socket.on('assign-admin', receive)
      return () => {
        socket.off('receive-message', receive)
        socket.off('connect', onConnect)
        socket.off('assign-admin', assignAdmin)
      }
    }
  }, [socket, session])
  return (
    <>
      {isLoading || status == 'unauthenticated' ? null : (
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
