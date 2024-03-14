'use client'

import { Avatar, Button, Center, FileInput, TextInput } from '@mantine/core'
import { Session } from 'next-auth'
import { useState } from 'react'

export default function EditProfile({ session }: { session: Session | null }) {
  const [userInfo, setUserInfo] = useState(session?.user)
  // onChange={(e) => setUserInfo({ ...userInfo, propertyName: e.target.value })}

  console.log(session)
  return (
    <form>
      <Center classNames={{ root: 'flex flex-col gap-3' }}>
        <Avatar size="xl" src={session?.user.avatar} />
        <TextInput
          label="display name"
          value={userInfo?.displayName}
          required
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev!, displayName: e.target.value }))
          }
        />
        <TextInput
          label="name"
          value={userInfo?.displayName}
          required
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev!, name: e.target.value }))
          }
        />
        <Button type="submit">Save</Button>
      </Center>
    </form>
  )
}
