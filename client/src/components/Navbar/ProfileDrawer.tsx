"use client"

import { Avatar, Button, Divider, Drawer, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks"
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface ProfileDrawerProps {
  session: Session
}

export default function ProfileDrawer({ session }: ProfileDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
      >
        <div className="flex flex-col gap-8">
          <Group gap={28} justify="center">
            <Avatar
              src={session.user.image}
              size="xl"
            />
            <div className="flex flex-col gap-2">
              <Text lineClamp={1}>Email: {session.user.email}</Text>
              <Text c="dark" lineClamp={1}>Display name: {session.user.displayName}</Text>
            </div>
          </Group>
          <Divider />
          <Button
            variant="outline"
            color="red"
            onClick={() => signOut({ redirect: true })}
          >
            Logout
          </Button>
        </div>
      </Drawer>

      <Button onClick={open}>{session.user.displayName}</Button>
    </>
  )
}
