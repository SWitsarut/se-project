'use client'
import { AdminMsg, sendingMSG } from '@/types/chat'
import { Button, Center, Loader, TextInput } from '@mantine/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserChip from './_component/UserChip'
import { Connection } from '@/components/ChatProvider'
import { message } from '@/types/message'
import ChatChip from '@/app/(user)/_components/ChatChip'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useScrollIntoView } from '@mantine/hooks'

export default function AdminChat({ users }: { users: AdminMsg[] }) {
  const socket = useContext(Connection)
  const session = useSession()
  const [currentUser, setCurrentUser] = useState<string>('')
  const [currentUserData, setCurrentUserData] = useState<AdminMsg | null>(null)
  const [msgs, setMsgs] = useState<message[] | []>([])
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >()

  useEffect(() => {
    scrollIntoView({
      alignment: 'start',
    })
  }, [msgs, scrollIntoView])

  useEffect(() => {
    const getmsg = async () => {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/chat/getmsgs`,
        {
          method: 'POST',
          body: JSON.stringify({
            user: currentUser,
          }),
        },
      )
      const msgs: message[] = await response.json()
      console.log(msgs)
      setMsgs(msgs)
      setLoading(false)
    }
    if (currentUser !== '') {
      getmsg()
    }
  }, [currentUser])

  useEffect(() => {
    if (socket) {
      const sended = async (confirm: string) => {
        const { id, msg } = await JSON.parse(confirm)
        console.log('sended', id, msg)
        setMsgs((prev) => {
          return [...prev, msg]
        })
      }

      const receive = (msg: message) => {
        console.log('admin receive', msg)
        // if (msg.receiver == session.data?.user.id) {
        setMsgs((prev) => [...prev, msg])
        // }
      }

      socket.on('receive-message', receive)
      socket.on('sended', sended)
      return () => {
        socket.off('receive-message', receive)
        socket.off('sended', sended)
      }
    }
  }, [session.data?.user.id, socket])

  useEffect(() => {
    console.log(users)
  }, [users])
  return (
    <div className="w-full flex flex-row border border-gray-300 rounded-md">
      <section className="flex">
        <div className="overflow-y-scroll h-full">
          {users?.map((user, index) => {
            return (
              <UserChip
                onClick={() => {
                  setCurrentUser(user.id)
                  setCurrentUserData(user)
                }}
                key={index}
                user={user}
                selected={user.id == currentUser}
              />
            )
          })}
        </div>
      </section>
      <section className="w-full h-full">
        <Center classNames={{ root: 'h-14 font-bold' }}>
          {currentUserData?.displayName}
        </Center>
        <div
          className="flex flex-col p-3 gap-3 h-96 overflow-y-scroll bg-gray-300"
          ref={scrollableRef}
        >
          {!loading ? (
            msgs?.map((msg, index) => {
              if (
                msg.sender == session.data?.user.id ||
                msg.sender == currentUser
              ) {
                return (
                  <div
                    key={index}
                    ref={index === msgs.length - 1 ? targetRef : null}
                  >
                    <ChatChip reverse message={msg} />
                  </div>
                )
              }
            })
          ) : (
            <Loader color="blue" className="m-auto" />
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const msg: sendingMSG = {
              content: text.trim(),
              sender: session.data?.user.id,
              receiver: currentUser,
            }
            socket?.emit('message', JSON.stringify(msg))
            setText('')
          }}
          className="flex flex-row w"
        >
          <>
            <TextInput
              value={text}
              onChange={(e) => setText(e.target.value)}
              classNames={{ root: 'w-full' }}
            />
            <Button type="submit">
              <IconSend />
            </Button>
          </>
        </form>
      </section>
    </div>
  )
}
