"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { handleSetPaymentIntent } = useCart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    if(error) {
      console.log(error);
    } else {
      handleSetPaymentIntent(null);
      router.push("/success");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{layout: 'tabs'}}/>
      <Button type="submit" disabled={!stripe || !elements}>Checkout</Button>
    </form>
  )
}
