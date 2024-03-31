"use client";

import BookItem from "@/components/BookItem";
import { BookItemType } from "@/types/book";
import { Loader, Text, Title } from "@mantine/core";
import { IconShoppingBagHeart } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

interface WishListProps {
  userId: string
}

export default function WishList({ userId }: WishListProps) {
  const [wishlists, setWishlists] = useState<BookItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const getMyWishList = useCallback(async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wishlist/${userId}`);
    const data = await res.json();
    setWishlists(data);
    setIsLoading(false);
  }, [])

  useEffect(() => {
    getMyWishList();
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader size="xl" />
        </div>
      ) : (
        <>
          {wishlists.length > 0 ? (
            wishlists.map((wishlist) => (
              <BookItem key={wishlist.isbn} book={wishlist}/>
            ))
          ) : (
            <div className="mx-auto text-center flex flex-col gap-6">
              <IconShoppingBagHeart className="mx-auto size-32" />
              <Title>{`You don't have any wishlist yet`}</Title>
              <Text size="xl" fw={600}>
                Add some books to your wishlist
              </Text>
            </div>
          )}
        </>
      )}
    </>
  )
}
