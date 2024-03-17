import { Suspense } from "react";
import BookSection from "./BookSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <BookSection />
      </Suspense>
    </>
  );
}
