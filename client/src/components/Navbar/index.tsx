"use client"

import { Button, Indicator } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileDrawer from "./ProfileDrawer";
import { IconShoppingCart } from "@tabler/icons-react";
import { useCart } from "../CartProvider";
import Image from "next/image";
import Logo from "../../../public/logo.png";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  return (
    <>
      <header className="overflow-hidden w-full h-20 bg-white/75 backdrop-blur-md flex border shadow-md px-4 md:px-8 sticky top-0 z-50">
        <div className="w-full flex items-center">
          <Link scroll={false} href={"/"} className="flex items-center justify-start">
            <Image className="w-[140px] h-[40px] lg:w-[230px] lg:h-[65px]" src={Logo} alt="logo"/>
          </Link>
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
    </>
  )
}
