"use client";

import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react";

interface SuccessPageProps {
  searchParams: {
    id?: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  if(!searchParams.id) {
    redirect("/");
  }

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/payment-intent?payment-intent-id=${searchParams.id}`).then((res) => { 
      if(res.status === 404) {
        router.push("/");
      }
      return res.json();
    }).then((result) => {
      if(result.error || result.paymentIntent.status === "succeeded") {
        router.push("/");
      }
    })
  }, [])
  
  return (
    <>
      Success
    </>
  )
}