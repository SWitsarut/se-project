"use client";

import { Button } from "@mantine/core";
import { IconHeartPlus, IconHeartFilled } from "@tabler/icons-react"
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface WishlistButton {
  isbn: string
}

export default function WishlistButton({ isbn }: WishlistButton) {
  const { data: session} = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);

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
    }
  }

  const fetchIsInWishlist = useCallback(async () => {
    if(session) {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist/${session.user.id}/${isbn}`)
      .then((res) => res.json())
      .then((data) => {
        setIsInWishlist(data.isInWishlist);
        setIsInLibrary(data.isInLibrary);
      })
    }
  }, [isbn, session]);

  useEffect(() => {
    fetchIsInWishlist();
  }, [fetchIsInWishlist]);

  return (
    <Button
      disabled={isLoading || isInLibrary}
      loading={isLoading}
      onClick={handleWishlist}
      radius="xl"
      size="sm"
      variant="outline" 
    >
      {isInWishlist ? <IconHeartFilled /> : <IconHeartPlus />}
    </Button>
  )
}
