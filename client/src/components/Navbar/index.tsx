"use client"

import { Button, Indicator } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileDrawer from "./ProfileDrawer";
import { IconShoppingCart } from "@tabler/icons-react";
import { useCart } from "../CartProvider";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  return (
    <header className="overflow-hidden w-full h-20 bg-white/75 backdrop-blur-md flex border shadow-md px-4 md:px-8 sticky top-0 left-0 z-50">
      <div className=" w-full flex items-center justify-start">
        <Link href={"/"}><h1 className="text-primary">Logo</h1></Link>
      </div>
      <div className="w-full flex items-center justify-end gap-4">
        <Link href={"/cart"}>
          <Indicator
            color="red"
            inline
            disabled={cart.length < 1}
            size={16}
            label={cart.length}
          >
            <Button>
              <IconShoppingCart />
            </Button>
          </Indicator>
        </Link>
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
