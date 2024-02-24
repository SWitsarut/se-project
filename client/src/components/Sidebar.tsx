"use client"

import { AppShell, Avatar, Burger, Button, Divider, Group, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconLogout } from "@tabler/icons-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { adminMenu, publisherMenu } from "@/utils/menu";

export default function Sidebar({
  children, session
}: { 
  children: React.ReactNode,
  session: Session
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" className="text-xl font-bold">Logo | {session.user.role === "ADMIN" ? "Admin" : "Publisher"}</Link>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="gap-6 h-full" p="md">
        <Group>
          <Avatar
            className="md:mx-auto"
            size="xl"
            src={session.user.image}
            alt={session.user.displayName}
          />
          <div className="md:mx-auto md:text-center">
            <Text size="xl" fw={700}>{session.user.displayName}</Text>
            <Text c="dimmed" size="md">{session.user.email}</Text>
          </div>
        </Group>
        <Divider />
        <Link href="/">
          <Button
            size="lg"
            leftSection={<IconHome />}
            justify="left"
            variant="subtle"
            fullWidth
          >
            Home
          </Button>
        </Link>
        {/* Publisher Menu */}
        {session.user.role === "PUBLISHER" && (
          publisherMenu.map((menu, index) => (
            <Link onClick={() => close()} key={index} href={menu.link}>
              <Button
                size="lg"
                leftSection={<menu.icon />}
                justify="left"
                variant={pathname === menu.link ? "light" : "subtle"}
                fullWidth
              >
                {menu.label}
              </Button>
            </Link>
          ))
        )}
        {/* Admin Menu */}
        {session.user.role === "ADMIN" && (
          adminMenu.map((menu, index) => (
            <Link onClick={() => close()} key={index} href={menu.link}>
              <Button
                size="lg"
                leftSection={<menu.icon />}
                justify="left"
                variant={pathname === menu.link ? "light" : "subtle"}
                fullWidth
              >
                {menu.label}
              </Button>
            </Link>
          ))
        )}
        <Button
          size="lg"
          leftSection={<IconLogout />}
          onClick={() => signOut()}
          justify="left"
          color="red"
          variant="subtle"
        >
          Log out
        </Button>
      </AppShell.Navbar>
      <AppShell.Main><div className="flex flex-col gap-4 md:px-12 md:py-6">{children}</div></AppShell.Main>
    </AppShell>
  )
}