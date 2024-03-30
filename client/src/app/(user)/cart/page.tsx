import Link from "next/link";
import CartList from "./CartList";
import { Button, Loader } from "@mantine/core";
import { Suspense } from "react";
import { getCurrentSession } from "@/libs/getCurrentSession";

export default async function CartPage() {
  const session = await getCurrentSession();

  return (
    <>
      <div className="prose mx-auto text-center">
        <h1>Shopping Cart</h1>
      </div>

      <div className="py-8 container max-w-4xl mx-auto">
        {session?.user ? (
          <Suspense fallback={<div className="flex justify-center w-full max-w-3xl"><Loader size={"xl"}/></div>}>
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
