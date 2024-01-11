"use client"

import { Avatar, Group, Text } from "@mantine/core";
import { Session } from "next-auth";

interface ProfileProps {
  session: Session
}

export default function Profile({ session }: ProfileProps) {
  return (
    <>
      <div className="border">
        <Group>
          <Avatar src={session.user.image} size={128} />
          <div>
            <Text>Email: {session.user.email}</Text>
            <Text>Display name: {session.user.displayName}</Text>
          </div>
        </Group>
      </div>
    </>
  )
}
