"use client";

import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookCart } from "@/types/book";
import { BASE_URL } from "@/utils";
import { Loader } from "@mantine/core";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const searchParams = useSearchParams();
  const paymentIntentIdParams = searchParams.get("payment-intent-id");
  const [selectedItem, setSelectedItem] = useState<BookCart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  }

  useEffect(() => {
    const fetchPaymentIntentId = async () => {
      const res = await fetch(`${BASE_URL}/api/payment-intent?payment-intent-id=${paymentIntentId}`);

      if(res.status == 404) {
        redirect("/cart");
      }
      
      const data = await res.json();

      if(data.error) {
        console.log(data.error);
      } else {
        setClientSecret(data.paymentIntent.client_secret);
      }
    }
    const getPaymentIntentId: any = localStorage.getItem("paymentIntent");
    const paymentIntentId = JSON.parse(getPaymentIntentId);
    const getSelectedItem: any = localStorage.getItem("selectedItem");
    const selectedItems: BookCart[] = JSON.parse(getSelectedItem);
    
    if(!selectedItems || (paymentIntentIdParams !== paymentIntentId)) {
      redirect("/cart")
    }
    setSelectedItem(selectedItems);
    
    fetchPaymentIntentId();
    setIsLoading(false);
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        clientSecret && (
          <>
            {selectedItem.map((data) => (
              <div key={data.isbn}>{data.title}</div>
            ))}
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          </>
        )
      )}
    </>
  )
}