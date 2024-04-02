"use client"

import { adminMenu, publisherMenu, userMenu } from "@/utils/menu";
import { Avatar, Button, Divider, Drawer, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks"
import { IconLogout } from "@tabler/icons-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface ProfileDrawerProps {
  session: Session
}

export default function ProfileDrawer({ session }: ProfileDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position="right"
        size={"xs"}
        opened={opened}
        onClose={close}
        zIndex={1000}
      >
        <div className="flex flex-col gap-4">
          <Group>
            <Avatar
              src={session.user.avatar}
              size="xl"
            />
            <div className="flex flex-col gap-2">
              <Text lineClamp={1} fw={700}>Email: <Text span classNames={{root: "text-wrap break-words"}}>{session.user.email}</Text></Text>
              <Text lineClamp={1} c="dark" fw={700}>Display name: <Text span fw={400} classNames={{root: "text-wrap break-words"}}>{session.user.displayName}</Text></Text>
              {session.user.role === "PUBLISHER" && (
                <Text lineClamp={1} c="dark" fw={700}>Publisher name: <Text span fw={400} classNames={{root: "text-wrap break-words"}}>{session.user.publisher}</Text></Text>
              )}
            </div>
          </Group>
          <Divider />
          <Group>
            <Text c="dimmed" fw={500} className="w-full">Menu</Text>
            {userMenu.map((data, index) => (
              <Link className="w-full flex" key={index} href={data.link}>
                <Button onClick={close} justify="left" fullWidth leftSection={<data.icon />} variant="subtle">
                  {data.label}
                </Button>
              </Link>
            ))}
          </Group>
          {session.user.role === "ADMIN" && (
            <>
              <Divider />
              <Text c="dimmed" fw={500} className="w-full">Admin Menu</Text>
              <Group>
              {adminMenu.map((data, index) => (
                <Link className="w-full flex" key={index} href={data.link}>
                  <Button onClick={close} justify="left" fullWidth leftSection={<data.icon />} variant="subtle">
                    {data.label}
                  </Button>
                </Link>
              ))}
              </Group>
            </>
          )}
          {session.user.role === "PUBLISHER" && (
            <>
              <Divider />
              <Text c="dimmed" fw={500} className="w-full">Publisher Menu</Text>
              <Group>
              {publisherMenu.map((data, index) => (
                <Link className="w-full flex" key={index} href={data.link}>
                  <Button onClick={close} justify="left" fullWidth leftSection={<data.icon />} variant="subtle">
                    {data.label}
                  </Button>
                </Link>
              ))}
              </Group>
            </>
          )}
          <Divider />
          <Button
            leftSection={<IconLogout />}
            variant="outline"
            color="red"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </Drawer>

      <Button classNames={{ root: "w-full max-w-40" }}onClick={open}>{session.user.displayName}</Button>
    </>
  )
}
