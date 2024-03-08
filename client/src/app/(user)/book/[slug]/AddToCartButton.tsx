"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";

interface AddToCartButtonProps {
  price: number;
  isbn: string;
}

export default function AddToCartButton({ isbn, price }: AddToCartButtonProps) {
  const { addToCart, check, isLoading } = useCart();

  return (
    <>
      <Button
        disabled={check(isbn) || isLoading}
        onClick={() => addToCart(isbn)}
        size="lg"
        radius="xl"
      >
        ฿ {price}
      </Button>
    </>
  );
}
