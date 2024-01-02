"use client"

import { Button } from "@mantine/core";
import { useSession } from "next-auth/react"
import Link from "next/link";
import ProfileDrawer from "./ProfileDrawer";

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <header className="w-full h-20 bg-white/75 backdrop-blur-md flex border shadow-md px-4 md:px-8 sticky top-0">
      <div className=" w-full flex items-center justify-start">
        <Link href={"/"}><h1 className="text-primary">Logo</h1></Link>
      </div>
      <div className="w-full flex items-center justify-end">
        {!(status === "loading") && (
          session ? (
            <>
              <ProfileDrawer session={session} />
            </>
          ) : (
            <>
              <Link href={"/login"}><Button>Login</Button></Link>
            </>
          )
        )}
      </div>
    </header>
  )
}
