import { Suspense } from "react";
import BookSection from "./BookSection";
import { Loader } from "@mantine/core";

export default function ViewAllPage({
  searchParams,
}: {
  searchParams: { "sorted-by"?: "view-all" | "best-selling" | "new" };
}) {
  const sortedBy = searchParams["sorted-by"] || "view-all";

  return (
    <div className="flex flex-col gap-6">
      {sortedBy === "best-selling" && (
        <div className="prose">
          <h1>Best selling</h1>
        </div>
      )}

      {sortedBy === "new" && (
        <div className="prose">
          <h1>New arrival</h1>
        </div>
      )}

      {sortedBy === "view-all" && (
        <div className="prose">
          <h1>All book</h1>
        </div>
      )}

      <Suspense fallback={<div className="flex justify-center w-full"><Loader size="xl" /></div>}>
        <BookSection key={sortedBy} sortedBy={sortedBy}/>
      </Suspense>
    </div>
  );
}
