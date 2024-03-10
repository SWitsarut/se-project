'use client'
import { AdminMsg, sendingMSG } from '@/types/chat'
import { Button, Loader, TextInput } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import UserChip from './_component/UserChip'
import { Connection } from '@/components/ChatProvider'
import { message } from '@/types/message'
import ChatChip from '@/app/(user)/_components/ChatChip'
import { IconSend } from '@tabler/icons-react'
import { getSession, useSession } from 'next-auth/react'

export default function AdminChat({ users }: { users: AdminMsg[] }) {
  const socket = useContext(Connection)
  const session = useSession()
  const [currentUser, setCurrentUser] = useState<string>('')
  const [msgs, setMsgs] = useState<message[] | []>([])
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    socket?.connect()
  }, [socket])

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

      const receive = async (msg: message) => {
        console.log(msg)
        setMsgs((prev) => [...prev, msg])
      }

      socket.on('receive-message', receive)
      socket.on('sended', sended)
      return () => {
        socket.off('receive-message', receive)
        socket.on('sended', sended)
      }
    }
  }, [socket])

  useEffect(() => {
    console.log(users)
  }, [users])
  return (
    <div className="h-full w-full flex flex-row">
      <section className="w-[30%] h-[100%]">
        <div className=" overflow-y-scroll h-[100%]">
          {users?.map((user, index) => {
            return (
              <UserChip
                onClick={() => {
                  setCurrentUser(user.id)
                }}
                key={index}
                user={user}
              />
            )
          })}
        </div>
      </section>
      <section className="w-full h-full">
        <div className="flex flex-col p-3 w-[100%] gap-3 h-full overflow-y-scroll bg-gray-300">
          {!loading ? (
            msgs?.map((msg, index) => {
              return <ChatChip key={index} reverse message={msg} />
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
          {/* {currentUser && !loading ? (
          ) : (
            <>
              <TextInput disabled classNames={{ root: 'w-full' }} />
              <Button disabled>
                <IconSend />
              </Button>
            </>
          )} */}
        </form>
      </section>
    </div>
  )
}
