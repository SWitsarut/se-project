import BookItem from "@/components/BookItem";
import { BookItemType } from "@/types/book";
import { Button, Title } from "@mantine/core";
import { IconSpeakerphone } from "@tabler/icons-react";
import Link from "next/link";

async function getNewBooks(): Promise<{newBooks: BookItemType[], bestSelling: BookItemType[]}> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book`, {
    cache: "no-store",
  })

  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function BookSection() {
  const { newBooks, bestSelling } = await getNewBooks();
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <IconSpeakerphone />
            <Title order={3}>New arrival</Title>
          </div>
          <div>
            <Link href={`/view-all?sorted-by=new`}><Button variant="outline">View all</Button></Link>
          </div>
        </div>
        <div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {newBooks.map((book) => (
            <BookItem key={book.isbn} book={book} />
            ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <IconSpeakerphone />
            <Title order={3}>Best selling</Title>
          </div>
          <div>
            <Link href={`/view-all?sorted-by=best-selling`}><Button variant="outline">View all</Button></Link>
          </div>
        </div>
        <div className="w-fit grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {bestSelling.map((book) => (
            <BookItem key={book.isbn} book={book} />
            ))}
        </div>
      </div>
    </div>
  )
}
