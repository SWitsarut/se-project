import BookItem from "@/components/BookItem";
import { BookItemType } from "@/types/book";

interface BookSectionProps {
  sortedBy: string
}

async function getAllBook(sortedBy: string): Promise<BookItemType[]> {
  const searchParams = new URLSearchParams({"sorted-by": sortedBy})
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/view-all?` + searchParams, {
    cache: "no-store"
  });

  return res.json();
}

export default async function BookSection({ sortedBy }: BookSectionProps) {
  const data = await getAllBook(sortedBy);
  return (
    <div className="w-full flex flex-col gap-4">
        <div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {data.map((book) => (
            <BookItem key={book.isbn} book={book} />
          ))}
        </div>
      </div>
  )
}
