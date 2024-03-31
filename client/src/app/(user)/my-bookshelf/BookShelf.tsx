import { BookShelfType } from "@/types/book";
import BookShelfItem from "./BookShelfItem"

interface BookShelfProps {
  userId: string
}

async function getOwnedBook(userId: string): Promise<BookShelfType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/bookshelf/${userId}`, {
    cache: "no-store"
  });

  return res.json();
}

export default async function BookShelf({ userId }: BookShelfProps) {
  const bookshelf = await getOwnedBook(userId);

  return (
    <div className="grid mx-auto justify-center xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {bookshelf.length > 0 ? (
        bookshelf.map((book) => (
          <BookShelfItem key={book.isbn} book={book} />
        ))
      ) : (
        <>
          <div className="mx-auto text-center flex flex-col gap-6">
            <p>{`You don't have any book yet`}</p>
          </div>
        </>
      )}
    </div>
  )
}