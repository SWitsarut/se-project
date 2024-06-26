import CartItem from "./CartItem";
import { BookCart } from "@/types/book";
import { Text } from "@mantine/core";
import { IconShoppingCartX } from "@tabler/icons-react";

interface CartListProps {
  userId: string
}

async function getCartList(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${userId}`, {
    cache: "no-store"
  });

  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function CartList({ userId }: CartListProps) {
  const cart: BookCart[] = await getCartList(userId);

  return (
    <>
      {cart.length > 0 ? (
        <div className="flex flex-col gap-16">
          <CartItem cartItems={cart}/>
        </div>
      ) : (
        <div className="py-24 text-center">
          <Text c="dark" fw="bold">The shopping cart is currently empty.</Text>
          <IconShoppingCartX size={128}/>
        </div>
      )}
    </>
  )
}
