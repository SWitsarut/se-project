import Link from "next/link";
import CartList from "./CartList";
import { Button, Loader } from "@mantine/core";
import { Suspense } from "react";
import { getCurrentSession } from "@/libs/getCurrentSession";

export default async function CartPage() {
  const session = await getCurrentSession();
  return (
    <>
      <div className="prose w-full max-w-4xl mx-auto text-center">
        <h1>Shopping Cart</h1>
      </div>

      <div className="py-8 w-full max-w-4xl mx-auto">
        {session?.user ? (
          <Suspense fallback={<div className="flex mx-auto justify-center w-full max-w-3xl"><Loader size={"xl"}/></div>}>
            <CartList userId={session.user.id}/>
          </Suspense>
        ) : (
          <>
            <div className="prose w-full max-w-4xl mx-auto text-center">
              <h2>You are not logged in</h2>
              <p>
                Please <Link href="/login">login</Link> to view your cart
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
