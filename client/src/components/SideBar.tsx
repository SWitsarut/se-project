"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";

interface SideBarProps {
  data: {
    room: {
      id: string;
      roomName: string;
      serverId: string;
    }[];
    users: {
      displayName: string;
      email: string;
    }[];
  } & {
    id: string;
    serverName: string;
    serverImg: string | null;
    userIDs: string[];
  };
}

export default function SideBar({ data }: SideBarProps) {
  const [roomName, setRoomName] = useState("");
  const { createRoom } = useSocket();

  const create = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/server-management/create-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({roomName, serverId: data.id})
    })

    if(res.ok) {
      createRoom(data.id)
    }
  }

  return (
    <div className="min-h-screen border px-4 py-6 mr-10">
      <Text fw={800} size="xl" c="primary">{data.serverName}</Text>
      <div>
        <Text size="lg" fw={600} c="dark">User:</Text>
        {data.users.map((user) => (
          user.displayName
        ))}
      </div>
      <div>
        <TextInput onChange={(e) => setRoomName(e.target.value)} value={roomName} placeholder="Enter Roomname"/>
        <Button onClick={create}>Create room</Button>
      </div>
    </div>
  );
}
