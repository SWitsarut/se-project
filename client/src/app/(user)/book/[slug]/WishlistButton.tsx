"use client";

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeartPlus, IconHeartFilled, IconAlertCircle } from "@tabler/icons-react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface WishlistButton {
  isbn: string
  isOwned: boolean
}

export default function WishlistButton({ isbn, isOwned }: WishlistButton) {
  const { data: session} = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const handleWishlist = async () => {
    if(session) {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist/${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isbn,
        })
      })
      const data = await res.json();
      if(data.error) {
        console.error(data.error);
      } else {
        fetchIsInWishlist();
      }
      setIsLoading(false);
    } else {
      open();
    }
  }

  const fetchIsInWishlist = useCallback(async () => {
    if(session) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist/${session.user.id}/${isbn}`)
      .then((res) => res.json())
      .then((data) => {
        setIsInWishlist(data.isInWishlist);
      })
    }
  }, [isbn, session]);

  useEffect(() => {
    fetchIsInWishlist();
  }, [fetchIsInWishlist]);

  return (
    <>
      <Modal centered opened={opened} onClose={close}>
        <div className="flex flex-col items-center justify-center">
          <IconAlertCircle className="size-20 text-orange-300"/>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">You need to login to add to wishlist</h2>
            <Button classNames={{ root: "mx-auto" }} onClick={() => router.push("/login")} size="sm">Login</Button>
          </div>
        </div>
      </Modal>
      
      <Button
        disabled={isLoading || isOwned}
        loading={isLoading}
        onClick={handleWishlist}
        radius="xl"
        size="sm"
        variant="outline" 
      >
        {isInWishlist ? <IconHeartFilled /> : <IconHeartPlus />}
      </Button>
    </>
  )
}
