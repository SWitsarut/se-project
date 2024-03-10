"use client";

import { BookCart } from "@/types/book";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface CartContextType {
  cart: string[]
  selectedItem: BookCart[]
  addToCart: (isbn: string) => void
  removeFromCart: (isbn: string) => void
  disableAddToCart: (isbn: string) => boolean
  resetCart: () => void
  paymentIntentId: string | null
  handleSetPaymentIntent: (val: string | null) => void
  handleSetSelectedItem: (isbn: BookCart[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider = ({ children } : CartProviderProps) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<BookCart[]>([]);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getPaymentIntent:any = localStorage.getItem("paymentIntent");
    const paymentIntent = JSON.parse(getPaymentIntent);
    
    setPaymentIntentId(paymentIntent);
  }, []);

  const disableAddToCart = (isbn: string): boolean => {
    const existingBook = cart.findIndex((item) => item === isbn);
    return existingBook !== -1;
  }

  const addToCart = async (isbn: string) => {
    if(session) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbn })
      });
      
      const data = await res.json();
      console.log(data);
      setCart((prevState) => ([ ...prevState, isbn]));
      router.refresh();
    }
  }

  const removeFromCart = async (isbn: string) => {
    if(session) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session.user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isbn })
      })
      
      const data = await res.json();
      console.log(data);
      const newCartItem = cart.filter((item) => item !== isbn);
      const newSelectedItem = selectedItem.filter((book) => book.isbn !== isbn);
      setSelectedItem(newSelectedItem);
      setCart(newCartItem);
      router.refresh();
    }
  }

  
  const fetchCartItem = useCallback(async () => {
    if(session) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart/${session.user.id}/get-isbn`);
      const data = await res.json();
      setCart(data);
    } else {
      setCart([]);
    }
  }, [session]);
  
  const handleSetPaymentIntent = useCallback((value: string | null) => {
    localStorage.setItem("paymentIntent", JSON.stringify(value));
    setPaymentIntentId(value)
  }, []);
  
  useEffect(() => {
    fetchCartItem();
  }, [fetchCartItem]);
  
  const resetCart = async () => {
    fetchCartItem();
  }

  const handleSetSelectedItem = useCallback((value: BookCart[]) => {
    localStorage.setItem("selectedItem", JSON.stringify(value));
    setSelectedItem(value);
  }, []);
  
  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    disableAddToCart,
    resetCart,
    paymentIntentId,
    handleSetPaymentIntent,
    selectedItem,
    handleSetSelectedItem,
  }
  
  return (
    <CartContext.Provider value={value}>
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