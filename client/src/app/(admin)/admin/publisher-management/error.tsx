"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }
  return (
    <div className="mx-auto">
        {process.env.NODE_ENV == "production" ? (
          <>
            <h1>Internal Server Error</h1>
            <h4>Digest: {error.digest} used to match the corresponding error in server-side logs.</h4>
          </>
        ) : (
          <>
            <h1>Internal Server Error</h1>
            <h2>{error.message}</h2>
          </>
        )}
      <Button onClick={reload}>Try again</Button>
    </div>
  );
}
