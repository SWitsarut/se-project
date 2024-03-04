"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface CartContextType {
  cart: string[]
  addToCart: (isbn: string) => void
  removeFromCart: (isbn: string) => void
  check: (isbn: string) => boolean
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider = ({ children } : CartProviderProps) => {
  const [cart, setCart] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const check = (isbn: string): boolean => {
    const existingBook = cart.findIndex((item) => item === isbn)
    return existingBook !== -1;
  }

  const addToCart = async (isbn: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session?.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isbn })
    })
    
    const data = await res.json();
    console.log(data);
    fetchCartItem();
  }

  const removeFromCart = async (isbn: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session?.user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ isbn })
    })
    
    const data = await res.json();
    console.log(data);
    fetchCartItem();
  }

  const fetchCartItem = useCallback(async () => {
    setIsLoading(true);
    if(session) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session.user.id}`);
      const data = await res.json();
      setCart(data.map((isbn: string) => isbn));
    } else {
      setCart([]);
    }
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    fetchCartItem();
  }, [fetchCartItem]);
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isLoading, check }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext);
  if(context === undefined) {
    throw new Error("useCart must be used within a cartProvider")
  }

  return context;
}