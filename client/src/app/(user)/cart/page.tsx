import Link from "next/link";
import CartList from "./CartList";
import { getCurrentSession } from "@/libs/getCurrentSession"
import { Button } from "@mantine/core";
import { Suspense } from "react";

export default async function CartPage() {
  const session = await getCurrentSession();

  return (
    <>
      <div className="prose mx-auto text-center">
        <h1>Shopping Cart</h1>
      </div>

      <div className="py-8 container max-w-4xl mx-auto">
        {session ? (
          <Suspense>
            <CartList userId={session.user.id}/>
          </Suspense>
        ) : (
          <>
            <Link href={`/login`}><Button>Login</Button></Link>
          </>
        )}
      </div>
    </>
  )
}
