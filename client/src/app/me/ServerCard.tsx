"use client"

import { Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function ServerCard({  serverId ,serverName, roomId }: { serverId: string, serverName: string, roomId: string}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Text>{serverName}</Text>
      <Button onClick={() =>router.push(`/room/${serverId}/${roomId}`)}>Go to {serverName}</Button>
    </div>
  )
}