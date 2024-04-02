import { BookShelfType } from "@/types/book";
import { Button, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface BookShelfItemProps {
  book: BookShelfType
}

export default function BookShelfItem({ book }: BookShelfItemProps) {
  return (
    <div className="w-44 flex flex-col items-center rounded-lg bg-white border shadow-lg hover:shadow-primary hover:scale-105 duration-150">
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
          className="w-40 h-full aspect-[1/1.414]"
          priority
        />
        <div className="absolute w-full bottom-0 px-2 pt-10 pb-2 bg-gradient-to-t from-black to-black/0">
          <Tooltip classNames={{ tooltip: "break-words"}} multiline maw={200} label={book.title}>
            <Text classNames={{ root: "break-words" }} fw={600} mih={24} mah={72} c="white" lineClamp={3}>{book.title}</Text>
          </Tooltip>
        </div>
      </Link>
      {/* Detail section */}
      <div className="w-full p-2 flex flex-col gap-2">
        <div className="w-full">
          <Text c="dark" h={18} size="xs" lineClamp={1}>{book.authors.map((author) => author).join(" / ")}</Text>
          <Text c="dark" h={18} size="xs" lineClamp={1}>{book.publisher}</Text>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Link href={`/book/${book.title}/read`} className="w-full">
            <Button fullWidth>
              Read
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
