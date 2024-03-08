"use client";

import { useCart } from "@/components/CartProvider";
import { BookCart } from "@/types/book";
import { Button, Checkbox, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CartItemProps {
  cartItem: BookCart[]
}

export default function CartItem({ cartItem }: CartItemProps) {
  const { removeFromCart } = useCart();

  const [isCheckAll, setIsCheckAll] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string[]>(cartItem.map((book) => book.isbn));
  const [totalPrice, setTotalPrice] = useState<number>(cartItem.reduce((acc, book) => acc + book.price, 0));

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setSelectedItem((prevState) => ([...prevState, id]));
    if(!checked) {
      setSelectedItem((prevState) => (prevState.filter((item) => item !== id)))
    }
  }

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckAll(!isCheckAll);
    setSelectedItem(cartItem.map((book) => book.isbn));
    if(!e.target.checked) {
      setSelectedItem([]);
    }
  }

  useEffect(() => {
    const newCartItem = cartItem.filter((book) => selectedItem.includes(book.isbn));
    const price = newCartItem.reduce((acc, book) => acc + book.price, 0);
    setTotalPrice(price);
  }, [cartItem, selectedItem]);

  return (
    <>
    <div className="flex flex-col gap-2">
      {cartItem.map((book) => (
        <div key={book.isbn} className="table w-full gap-2 border-b-2 pb-2">
          <div className="table-cell align-middle">
            <Checkbox checked={selectedItem.includes(book.isbn)} id={book.isbn} onChange={(e) => handleCheck(e)}/>
          </div>
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
      ))}
      <div className="mt-4">
        <Checkbox label="Select all" checked={isCheckAll} onChange={(e) => handleCheckAll(e)}/>
      </div>
    </div>

    <div className="flex flex-col items-end gap-4">    
      <div className="bg-slate-50 flex flex-col items-center px-10 py-8 space-y-4 shadow-md rounded-md">
        <Text fw={700} size="xl">Total Price ฿ {totalPrice}</Text>
        <Button>Checkout</Button>
      </div>
    </div>
  </>
  );
}