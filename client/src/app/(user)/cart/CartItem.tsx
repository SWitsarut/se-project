"use client";

import { useCart } from "@/components/CartProvider";
import { BookCart } from "@/types/book";
import { AspectRatio, Button, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";

interface CartItemProps {
  book: BookCart;
}

export default function CartItem({ book }: CartItemProps) {
  const { removeFromCart } = useCart();

  return (
    <div className="table w-full py-4 border-b-2">
      <div className="table-cell align-middle w-20 h-auto">
        <Image
          src={book.cover}
          alt={book.title}
          width={0}
          height={0}
          sizes="100vw"
          className="w-20 h-auto aspect-[1/1.414]"
        />
      </div>
      <div className="table-cell align-top px-2">
        <Text fw={700} classNames={{ root: "w-24 md:w-52 lg:w-80 break-words"}} lineClamp={2}>{book.title}</Text>
        <Text size="sm">฿ {book.price}</Text>
      </div>
      <div className="table-cell align-middle w-12">
        <Button onClick={() => removeFromCart(book.isbn)} leftSection={<IconTrash />} size="xs" variant="outline">Remove</Button>
      </div>
    </div>
  );
}
