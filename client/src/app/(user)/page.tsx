import { Suspense } from "react";
import BookSection from "./BookSection";

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <BookSection />
      </Suspense>
    </>
  );
}
