"use client";

import { useCart } from "@/components/CartProvider";
import { Button } from "@mantine/core";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
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
      alert(error.message)
    } else {
      handleSetPaymentIntent(null)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{layout: 'tabs'}}/>
      <Button type="submit" disabled={!stripe || !elements}>Checkout</Button>
    </form>
  )
}
