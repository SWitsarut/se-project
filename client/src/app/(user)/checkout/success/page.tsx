"use client";

import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react";

interface SuccessPageProps {
  searchParams: {
    id: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const router = useRouter();

  useEffect(() => {
    if(!searchParams.id) {
      router.push("/");
    };

    fetch(`/api/payment-intent?payment-intent-id=${searchParams.id}`).then((res) => { 
      if(res.status === 404) {
        router.push("/");
      }
      return res.json();
    }).then((result) => {
      if(result.error || result.paymentIntent.status !== "succeeded") {
        router.push("/");
      }
    });
  }, [router, searchParams.id])
  
  return (
    <>
      Success
    </>
  )
}