"use client"

import { Button, TextInput } from "@mantine/core"
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react"

interface AddServerProps {
  session: Session
}

export default function AddServer({ session }: AddServerProps) {
  const [serverName, setServerName] = useState("");
  const router = useRouter();
  
  const addServer = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/server-management/create-server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id ,serverName })
      })

      if(res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <TextInput onChange={(e) => setServerName(e.target.value)} value={serverName} />
      <Button onClick={addServer}>Create</Button>
    </div>
  )
}
