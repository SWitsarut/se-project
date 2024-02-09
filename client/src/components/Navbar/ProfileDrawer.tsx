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
      >
        <div className="flex flex-col gap-8">
          <Group>
            <Avatar
              src={session.user.image}
              size="xl"
            />
            <div className="flex flex-col gap-2">
              <Text fw={700} lineClamp={1}>Email: <Text span>{session.user.email}</Text></Text>
              <Text c="dark" fw={700} lineClamp={1}>Display name: <Text span fw={400}>{session.user.displayName}</Text></Text>
              <Text c="dark" fw={700} lineClamp={1}>Role: <Text span fw={400}>{session.user.role}</Text></Text>
              {session.user.role === "PUBLISHER" && (
                <Text c="dark" fw={700} lineClamp={1}>Publisher name: <Text span fw={400}>{session.user.publisher}</Text></Text>
              )}
            </div>
          </Group>
          <Divider />
          <Group>
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

      <Button onClick={open}>{session.user.displayName}</Button>
    </>
  )
}
