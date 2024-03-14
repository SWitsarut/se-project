'use client'

import { Avatar, Button, Group, Text } from '@mantine/core'
import { Session } from 'next-auth'
import Link from 'next/link'

interface ProfileProps {
  session: Session
}

export default function Profile({ session }: ProfileProps) {
  return (
    <>
      <div className="border flex justify-between items-center p-3">
        <Group>
          <Avatar src={session.user.image} size={128} />
          <div>
            <Text>Email: {session.user.email}</Text>
            <Text>Display name: {session.user.displayName}</Text>
          </div>
        </Group>
        <Link href={'/edit-profile'}>
          <Button>edit profile</Button>
        </Link>
      </div>
    </>
  )
}
