import BookItem from "@/components/BookItem";
import { BookResponse } from "@/types/book";

async function getNewBooks(): Promise<BookResponse[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book`, {
    cache: "no-store",
  })

  const data = await res.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}

export default async function BookSection() {
  const newBooks = await getNewBooks();
  return (
    <>
      <div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {newBooks.map((book) => (
          <BookItem key={book.isbn} book={book} />
        ))}
      </div>
    </>
  )
}
