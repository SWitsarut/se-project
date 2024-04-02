import { Suspense } from "react";
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import { Loader } from "@mantine/core";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string, page?: string, take?: string, "search-by"?: string};
}) {
  const searchQuery = searchParams.q || "";
  const searchBy = searchParams["search-by"] || "book-title";
  const page = Number(searchParams?.page) || 1;
  const take = Number(searchParams?.take) || 20;

  return (
    <div className="w-full flex flex-col gap-8">
      <SearchInput searchBy={searchBy} />

      <Suspense
        key={searchQuery+page+take+searchBy}
        fallback={
          <div className="w-full flex justify-center">
            <Loader size="xl" />
          </div>
        }
      >
        <SearchResult searchBy={searchBy} searchQuery={searchQuery} page={page} take={take} />
      </Suspense>
    </div>
  );
}
