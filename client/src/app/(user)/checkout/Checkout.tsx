"use client";

import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookCart } from "@/types/book";
import { Loader, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const searchParams = useSearchParams();
  const paymentIntentIdParams = searchParams.get("payment-intent-id");
  const router = useRouter();
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
      const searchParams = new URLSearchParams({ "payment-intent-id": paymentIntentId});
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/payment-intent?` + searchParams.toString());

      if(res.status == 404) {
        router.push("/");
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
        <div className="w-full max-w-3xl mx-auto flex justify-center">
          <Loader size="xl" />
        </div>
      ) : (
        clientSecret && (
          <>
            <div className="flex flex-col gap-4 mx-auto w-full max-w-3xl border p-4 bg-slate-50 rounded-md shadow-sm">
              <div className="flex justify-between">
                <Text c={"dark"} fw={800}>Item</Text>
                <Text c={"dark"} fw={800}>Price</Text>
              </div>
              {selectedItem.map((data) => (
                <div key={data.isbn} className="py-4 flex justify-between border-b">
                  <Link href={`/book/${data.title}`} target="_blank" className="flex gap-2">
                    <Image
                      className="w-20 h-auto aspect-[1/1.414]"
                      src={data.cover}
                      alt={data.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                    <Text className="hover:underline" c={"dark"} fw={600}>{data.title}</Text>
                  </Link>
                  <Text c={"dark"} fw={600}>{data.price} ฿</Text>
                </div>
              ))}
              <div className="flex justify-end">
                <Text c={"dark"} fw={800} size="lg">Total price: {selectedItem.reduce((acc, book) => acc + book.price, 0)} ฿</Text>
              </div>
            </div>
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          </>
        )
      )}
    </>
  )
}