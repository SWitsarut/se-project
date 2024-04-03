import CustomPagination from "@/app/(admin)/admin/_components/CustomPagination";
import BookItem from "@/components/BookItem";
import prisma from "@/libs/prisma";
import { BookItemType, BookResponse } from "@/types/book";

interface SearchResultProps {
  searchBy: string
  searchQuery: string
  take: number
  page: number
}

const getSearchResult = async (
  searchBy: string,
  searchQuery: string,
  take: number,
  page: number,
): Promise<{ data: BookItemType[], totalPage: number }> => {
  const searchParams = new URLSearchParams({
    "search-by": searchBy,
    "search-query": searchQuery,
    take: take.toString(),
    page: page.toString(),
  });
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/search?` + searchParams, {
    cache: "no-store",
  });

  return res.json();
};

export default async function SearchResult({
  searchBy,
  searchQuery,
  take,
  page,
}: SearchResultProps) {
  const { data, totalPage } = await getSearchResult(searchBy, searchQuery, take, page);

  return (
    <>
      <div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {data.map((book) => (
          <BookItem key={book.isbn} book={book} />
        ))}
      </div>

      <CustomPagination totalPage={totalPage} />
    </>
  );
}
