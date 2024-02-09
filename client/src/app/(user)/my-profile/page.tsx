"use client";

import { Button } from "@mantine/core";
import Profile from "./Profile";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if(!session) {
    return (
      <>
        <Link href={"/login"}><Button>Go to login</Button></Link>
      </>
    )
  }
  
  return (
    <Profile session={session} />
  )
}
