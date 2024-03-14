import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import { BookResponse } from "@/types/book";
import { Badge, Button, Text } from "@mantine/core";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/utils";

async function getBookData(slug: string): Promise<BookResponse> {
  const res = await fetch(`${BASE_URL}/api/book/${slug}`, {
    cache: "no-store",
  })

  const data = await res.json();

  if(data.error) {
    if(res.status == 404) {
      notFound();
    }
    throw new Error(data.error);
  }

  return data;
}

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return {
    title: `${decodeURIComponent(slug)}`,
  }
}

export default async function BookPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const book = await getBookData(slug);
  return (
    <div className="flex flex-col gap-16 px-4 w-full max-w-7xl mx-auto">
      <div className="prose mx-auto">
        <h1 className="break-words text-center">{book.title}</h1>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Image
            src={book.cover}
            alt={"book_cover"}
            height={0}
            width={0}
            sizes="100vw"
            className="w-72 h-full aspect-[1/1.414] shadow-2xl border"
          />
        </div>
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <Text fw={700}>author: <Text span>{book.authors.map((author) => author).join(" , ")}</Text></Text>
            <Text fw={700}>publisher: <Text span>{book.publisher}</Text></Text>
            <Text fw={700}>category: <Text span>{book.category}</Text></Text>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" radius="xl">Preview</Button>
            <AddToCartButton isbn={book.isbn} price={book.price} />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {book.genres.map((genre, index) => (
          <Badge key={index} variant="outline">{genre}</Badge>
        ))}
      </div>

      <div className="w-full whitespace-break-spaces">
        {book.description}
      </div>
    </div>
  );
}
