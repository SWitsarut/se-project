"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";

interface AddToCartButtonProps {
  price: number
  isbn: string
}

export default function AddToCartButton({ isbn, price }: AddToCartButtonProps) {
  const { addToCart, removeFromCart, check, isLoading } = useCart();

  return (
    <>
      {/* {check(isbn) ? ( */}
        {/* <Button loading={isLoading} onClick={() => removeFromCart(isbn)} size="lg" radius="xl">Remove from cart</Button> */}
      {/* // ) : ( */}
        <Button disabled={check(isbn) || isLoading} onClick={() => addToCart(isbn)} size="lg" radius="xl">฿ {price}</Button>
      {/* // )} */}
      {/* // {} */}
    </>
  )
}
