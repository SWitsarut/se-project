"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";

interface AddToCartButtonProps {
  price: number;
  isbn: string;
}

export default function AddToCartButton({ isbn, price }: AddToCartButtonProps) {
  const { addToCart, disableAddToCart } = useCart();
  return (
    <>
      <Button
        disabled={disableAddToCart(isbn)}
        onClick={() => addToCart(isbn)}
        size="lg"
        radius="xl"
        classNames={{ root: "px-1"}}
      >
        ฿ {price.toFixed(2)}
      </Button>
    </>
  );
}
