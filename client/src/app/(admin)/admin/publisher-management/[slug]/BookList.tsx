import { BookResponse } from "@/types/book";

interface BookListProps {
  slug: string
}

async function getBookList(slug: string): Promise<{ books: BookResponse[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-book-by-publisher/${slug}`, {
    cache: "no-store",
  })

  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function BookList({ slug }: BookListProps) {
  const { books } = await getBookList(slug);
  console.log(books)
  return (
    <>
      BookList
    </>
  )
}
