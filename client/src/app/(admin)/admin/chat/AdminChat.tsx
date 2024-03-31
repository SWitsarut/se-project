'use client'
import ChatChip from '@/app/(user)/_components/ChatChip'
import { Connection } from '@/components/ChatProvider'
import { AdminMsg, sendingMSG } from '@/types/chat'
import { message } from '@/types/message'
import { Button, Center, Loader, TextInput } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSend } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import UserChip from './_component/UserChip'

export default function AdminChat({ users }: { users: AdminMsg[] }) {
  const socket = useContext(Connection)
  const session = useSession()
  const [currentUserID, setCurrentUserID] = useState<string>('')
  const [currentUserData, setCurrentUserData] = useState<AdminMsg | null>()
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
            user: currentUserID,
          }),
        },
      )
      const msgs: message[] = await response.json()
      // console.log(msgs)
      setMsgs(msgs)
      setLoading(false)
    }
    if (currentUserID !== '') {
      getmsg()
    }
  }, [currentUserID])

  useEffect(() => {
    const sended = async (confirm: string) => {
      console.log("omg")
      const { id, msg } = await JSON.parse(confirm)
      console.log('sended', id, msg)
      setMsgs((prev) => {
        return [...prev, msg]
      })
    }

    const receive = (msg: message) => {
      console.log('admin receive', msg)
      setMsgs((prev) => [...prev, msg])
    }

    socket?.on('receive-message', receive)
    socket?.on('sended', sended)
    socket?.connect()

    return () => {
      socket?.off('sended', sended)
      socket?.off('receive-message', receive)
    }
  }, [])

  // useEffect(() => {
  //   console.log(users)
  // }, [users])
  return (
    <div className="w-full flex flex-row border border-gray-300 rounded-md">
      <section className="flex">
        <div className="overflow-y-scroll h-full">
          {users?.map((user, index) => {
            return (
              <UserChip
                onClick={() => {
                  setCurrentUserID(user.id)
                  setCurrentUserData(user)
                }}
                key={index}
                user={user}
                selected={user.id == currentUserID}
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
              // if (
              //   msg.sender == session.data?.user.id ||
              //   msg.sender == currentUserID
              // ) {
                return (
                  <div
                    key={index}
                    ref={index === msgs.length - 1 ? targetRef : null}
                  >
                    <ChatChip reverse message={msg} />
                  </div>
                )
              // }
            })
          ) : (
            <Loader color="blue" className="m-auto" />
          )}
        </div>
        <form
          onSubmit={(e) => {
            if (socket?.connected == false) socket.connect()
            e.preventDefault()
            const msg: sendingMSG = {
              content: text.trim(),
              sender: session.data?.user.id,
              receiver: currentUserID,
            }
            // console.log('socket?.connected', socket?.connected)
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
              disabled={!currentUserID}
              autoComplete="off"
            />
            <Button type="submit" disabled={!currentUserID}>
              <IconSend />
            </Button>
          </>
        </form>
      </section>
    </div>
  )
}
