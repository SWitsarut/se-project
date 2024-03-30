"use client";

import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { BookCart } from "@/types/book";
import { Button, Checkbox, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItemProps {
  cartItems: BookCart[]
}

export default function CartItem({ cartItems }: CartItemProps) {
  const {
    selectedItem,
    handleSetSelectedItem,
    cart,
    removeFromCart,
    paymentIntentId,
    handleSetPaymentIntent
  } = useCart();

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(selectedItem.reduce((acc, book) => acc + book.price, 0))
  const router = useRouter();

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, data: BookCart) => {
    const { checked } = e.target;
    if(!checked) {
      const newSelected = selectedItem.filter((book) => book.isbn !== data.isbn);
      handleSetSelectedItem(newSelected);
    } else {
      handleSetSelectedItem([...selectedItem, data]);
    }
  }

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.checked) {
      setIsCheckAll(false);
      handleSetSelectedItem([]);
    } else {
      setIsCheckAll(true);
      handleSetSelectedItem(cartItems)
    }
  }

  const proceedToCheckout = () => {
    if (selectedItem.length > 0) {
      setIsLoading(true);
      fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: selectedItem,
          payment_intent_id: paymentIntentId,
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        handleSetPaymentIntent(data.id);
        router.push(`/checkout?payment-intent-id=${data.id}`)
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error", error);
      });
    }
  }

  useEffect(() => {
    handleSetSelectedItem(cartItems);
  }, [handleSetSelectedItem, cartItems]);

  useEffect(() => {
    const newCartItem = selectedItem.filter((book) => cart.includes(book.isbn));
    const price = newCartItem.reduce((acc, book) => acc + book.price, 0);
    setTotalPrice(price);
  }, [cart, selectedItem]);

  useEffect(() => {
    selectedItem.length === cartItems.length ? setIsCheckAll(true) : setIsCheckAll(false);
  }, [selectedItem.length, cartItems.length]);

  return (
    <>
    <div className="flex flex-col gap-2">
      {cartItems.map((book, index) => (
        <div key={book.isbn} className={`${index % 2 == 0 && "bg-slate-100"} table w-full gap-2 py-2 px-2 border-b`}>
          <div className="table-cell align-middle">
            <Checkbox checked={selectedItem.findIndex((data) => data.isbn === book.isbn) !== -1} onChange={(e) => handleCheck(e, book)}/>
          </div>
          <Link href={`/book/${book.title}`}>
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
              <Text fw={700} classNames={{ root: "hover:underline w-24 md:w-52 lg:w-80 break-words"}} lineClamp={2}>{book.title}</Text>
              <Text size="sm">฿ {book.price}</Text>
            </div>
          </Link>
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
        <Text fw={700} size="xl">Summary {`(${selectedItem.length} ${selectedItem.length > 1 ? "items" : "item"})`}</Text>
        <Text fw={700} size="xl">Total Price ฿ {totalPrice}</Text>
        <Button loading={isLoading} onClick={proceedToCheckout} disabled={selectedItem.length < 1 || isLoading}>Proceed to Checkout</Button>
      </div>
    </div>
  </>
  );
}