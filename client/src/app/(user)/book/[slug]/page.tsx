import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import FavoriteButton from "./WishlistButton";
import Link from "next/link";
import ReviewInput from "./ReviewInput";
import CommentCard from "./CommentCard";
import ReportButton from "./ReportButton";
import { BookResponseWithComments } from "@/types/book";
import { Badge, Button, Rating, Text } from "@mantine/core";
import { notFound } from "next/navigation";
import { getCurrentSession } from "@/libs/getCurrentSession";

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  return {
    title: `${decodeURIComponent(slug)}`,
  }
}

async function getBookData(slug: string): Promise<BookResponseWithComments> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}`, {
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

const checkIsOwned = async (slug: string, userId?: string) => {
  if(userId) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}/${userId}`, {
      cache: "no-store",
    });
  
    return res.json();
  }
  
  return false;
}

export default async function BookPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getCurrentSession();

  const [book, isOwned] = await Promise.all([getBookData(slug), checkIsOwned(slug, session?.user.id)]);

  return (
    <div className="flex flex-col gap-16 px-4 w-full max-w-7xl mx-auto">
      <div className="prose mx-auto">
        <h1 className="break-words text-center">{book.title}</h1>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center md:justify-end">
          <Image
            src={book.cover}
            alt={"book_cover"}
            height={0}
            width={0}
            sizes="100vw"
            className="w-72 h-full aspect-[1/1.414] shadow-2xl border"
          />
        </div>
        <div className="w-full flex flex-col gap-8 max-w-xs mx-auto md:mx-0">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <Text fw={700}>author: <Text span>{book.authors.map((author) => author).join(" , ")}</Text></Text>
            <Text fw={700}>publisher: <Text span>{book.publisher}</Text></Text>
            <Text fw={700}>category: <Text span>{book.category}</Text></Text>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center mx-auto w-full">
              {isOwned ? (
                <Link className="mx-auto w-full max-w-36" href={`/book/${slug}/read`}>
                  <Button fullWidth variant="filled" size="lg" radius="xl">Read</Button>
                </Link>
              ) : (
                <div className="w-full grid grid-cols-2 gap-3 items-center">
                  <Button classNames={{ root: "w-2/3 mx-auto" }} variant="outline" size="compact-lg" radius="xl">Preview</Button>
                  <AddToCartButton isbn={book.isbn} price={book.price} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center mx-auto">
                <Text c={"yellow"}>{book.rating.toFixed(2)}</Text>
                <Rating size="md" fractions={2} value={book.rating} readOnly />
                <Text size="xs">({book.ratingCount} Rating)</Text>
              </div>
              <div className="flex mx-auto">
                <FavoriteButton isbn={book.isbn} isOwned={isOwned}/>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-b-2 py-1 w-full">
            <Text c="dimmed" fw={600}>Release date: </Text>
            <Text c="dimmed" fw={600}>{book.createdAt}</Text>
          </div>
          {session?.user.id && (
            <div className="flex justify-end place-items-end h-full">
              <ReportButton isOwned={isOwned} isbn={book.isbn} bookTitle={book.title} userId={session.user.id}/>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {book.genres.map((genre, index) => (
          <Badge key={index} variant="outline">{genre}</Badge>
        ))}
      </div>

      <div className="w-full whitespace-break-spaces">
        <Text>{book.description}</Text>
      </div>
      
      <ReviewInput existingReview={book.comments.some((comment) => comment.user.username === session?.user.username)} isOwned={isOwned} isbn={book.isbn} userId={session?.user.id} />
      
      <div className="flex flex-col gap-4">
        {book.comments.map((comment) => (
          <CommentCard key={comment.user.id} data={comment} />
        ))}
      </div>
    </div>
  );
}
