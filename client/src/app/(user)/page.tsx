import { Suspense } from "react";
import BookSection from "./BookSection";
import { Loader } from "@mantine/core";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div className="flex w-full mx-auto justify-center"><Loader size="xl" /></div>}>
        <BookSection />
      </Suspense>
    </>
  );
}
