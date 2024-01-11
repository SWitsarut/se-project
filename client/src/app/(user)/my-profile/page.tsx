import { authOption } from "@/libs/authOption"
import { Button } from "@mantine/core"
import { getServerSession } from "next-auth"
import Link from "next/link"
import Profile from "./Profile"

export default async function ProfilePage() {
  const session = await getServerSession(authOption)

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
