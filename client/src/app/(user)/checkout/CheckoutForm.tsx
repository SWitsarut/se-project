"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { handleSetPaymentIntent, fetchCartItem } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    
    if(error) {
      setIsLoading(false);
      console.log(error);
    } else {
      setTimeout(() => {
        fetchCartItem();
        setIsLoading(false);
        handleSetPaymentIntent(null);
        router.push(`/checkout/success?id=${paymentIntent.id}`);
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{layout: 'tabs'}}/>
      <Button loading={isLoading} type="submit" disabled={!stripe || !elements}>Checkout</Button>
    </form>
  )
}
