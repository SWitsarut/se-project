"use client";

import { Button, Loader, Text, Title } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react";

interface SuccessPageProps {
  searchParams: {
    id: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if(!searchParams.id) {
      router.push("/");
    };

    if(session) {
      fetch(`/api/payment-intent?payment-intent-id=${searchParams.id}`).then((res) => { 
        if(res.status === 404) {
          router.push("/");
        }
        return res.json();
      }).then((result) => {
        if(result.error || result.paymentIntent.status !== "succeeded" || result.userId !== session.user.id) {
          router.push("/");
        }
        setIsLoading(false);
      });
    } else {
      router.push("/")
    }
  }, [router, searchParams.id])
  
  return (
    <>
      {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Loader size="xl"/>
        </div>
      ) : (
        <div className="mx-auto bg-red max-w-lg text-center space-y-6">
          <Text c="green"><IconCircleCheck className="size-36"/></Text>
          <Title order={1}>Payment successful</Title>

          <div className="flex gap-4 mx-auto w-fit">
            <Button variant="outline" onClick={() => router.push("/")}>Continue shopping</Button>
            <Button onClick={() => router.push("/my-bookshelf")}>View bookshelf</Button>
          </div>
        </div>
      )}
    </>
  )
}