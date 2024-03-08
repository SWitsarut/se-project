"use client";

import { BookResponse } from "@/types/book";
import { Button, Modal, Rating, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

interface BookItemProps {
  book: BookResponse
}

export default function BookItem({ book }: BookItemProps) {
  const { data: session } = useSession();
  const { addToCart, check, isLoading } = useCart();
  const [ opened, { open, close } ] = useDisclosure(false);
  const router = useRouter();

  return (
    <>
      <div className="w-48 flex flex-col items-center rounded-lg bg-white border shadow-2xl">
        <Link
          href={`/book/${book.title}`}
          className="relative"
        >
          <Image
            src={book.cover}
            alt={"book_cover"}
            height={0}
            width={0}
            sizes="100vw"
            className="w-44 h-full aspect-[1/1.414]"
            priority
          />
          <div className="absolute w-full bottom-0 px-2 pt-10 pb-2 bg-gradient-to-t from-black to-black/0">
            <Tooltip classNames={{ tooltip: "break-words"}} multiline maw={200} label={book.title}>
              <Text classNames={{ root: "break-words" }} fw={600} mih={24} mah={72} c="white" lineClamp={3}>{book.title}</Text>
            </Tooltip>
          </div>
        </Link>
        {/* Detail section */}
        <div className="w-full p-2">
          <div className="w-full">
            <Text c="dark" h={18} size="xs" lineClamp={1}>{book.authors.map((author) => author).join(" / ")}</Text>
            <Text c="dark" h={18} size="xs" lineClamp={1}>{book.publisher}</Text>
          </div>
          <div className="w-full flex justify-between gap-4">
            <div>
              <Rating readOnly value={5} size="xs"/>
              <Text size="xs">Rating Count</Text>
            </div>
            <Button
              disabled={check(book.isbn) || isLoading}
              onClick={session ? () => addToCart(book.isbn) : () => open()}
              fullWidth
            >
              <Text truncate classNames={{ root: "text-sm" }}>฿ {book.price}</Text>
            </Button>

            {!session && (
              <Modal classNames={{ title: "font-bold" }} centered opened={opened} onClose={close} title="can't add book to cart">
                <div className="flex flex-col gap-4">
                  <Text>You must have login to add book into cart</Text>
                  <Button className="mx-auto" onClick={() => router.push("/login")}>Go to login</Button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
