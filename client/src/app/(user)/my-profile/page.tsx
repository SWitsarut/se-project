import { Button } from "@mantine/core";
import Profile from "./Profile";
import Link from "next/link";
import { Suspense } from "react";
import OrderHistory from "./OrderHistory";
import { getCurrentSession } from "@/libs/getCurrentSession";

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if(!session) {
    return (
      <>
        <Link href={"/login"}><Button>Go to login</Button></Link>
      </>
    )
  }
  
  return (
    <div className="flex flex-col gap-16 w-full max-w-7xl mx-auto">
      <Profile session={session} />
      
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-4">
        <div className="prose mx-auto text-center">
          <h2>Order History</h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <OrderHistory userId={session.user.id} />
        </Suspense >
      </div>
    </div>
  )
}
