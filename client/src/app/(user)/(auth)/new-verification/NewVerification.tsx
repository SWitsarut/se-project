"use client";

import Link from "next/link";
import { BASE_URL } from "@/utils";
import { Alert, Button, Loader, Text } from "@mantine/core";
import { IconCircleCheckFilled, IconExclamationCircle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function NewVerification() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  
  const onSubmit = useCallback(async () => {    
    try {
      const res = await fetch(`${BASE_URL}/api/auth/new-verification?token=${token}`, {
        method: "PUT",
      });
  
      const data = await res.json();
  
      if(res.ok) {
        setSuccess(data.message);
        setError("");
      } else {
        setSuccess("");
        setError(data.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }

  }, [token])

  useEffect(() => {
    onSubmit();
  }, [onSubmit])

  return (
    <div className="animate-fade-up bg-light w-full sm:max-w-[28rem] flex flex-col gap-4 mx-auto px-8 py-4 rounded-xl border shadow-lg">
      <div className="mx-auto prose">
        <h1>Auth</h1>
      </div>
      <div className="mx-auto">
        <Text c="dimmed" size="xl">Confirming your verification</Text>
      </div>
      {isLoading ? (
        <div className="mx-auto">
          <Loader size={72}/>
        </div>
      ) : (
        <>
          {success && (
            <Alert variant="light" color="green" icon={<IconCircleCheckFilled /> } title={success} />
          )}
          {error && (
            <Alert variant="light" color="red" icon={<IconExclamationCircle />} title={error} />
          )}
          <div className="mx-auto">
            <Link href={"/login"}><Button>Back to login</Button></Link>
          </div>
        </>
      )}
    </div>
  );
}
