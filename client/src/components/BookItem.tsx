"use client";

import { Button, Rating, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export default function BookItem() {
  return (
    <>
      <div className="w-48 flex flex-col items-center rounded-lg p-2 bg-white border shadow-2xl">
        {/* Todo navigate to single book page */}
        <Link href={`/`}>
          <Image
            src={`https://cdn-local.mebmarket.com/meb/server1/265529/Thumbnail/book_detail_large.gif?2`}
            alt={"book_cover"}
            height={0}
            width={0}
            sizes="100vw"
            className="w-44 h-full aspect-[1/1.414]"
          />
        </Link>
        <div className="w-full">
          {/* Todo navigate to single book page */}
          <Link href={`/`}>
            <Text classNames={{ root: "break-words" }} fw={700} h={72} lineClamp={3}>bookname</Text>
          </Link>
          <Text c="dark" h={18} size="xs" lineClamp={1}>author</Text>
          <Text c="dark" h={18} size="xs" lineClamp={1}>publisher</Text>
        </div>
        <div className="w-full flex justify-between gap-1.5">
          <div>
            <Rating readOnly value={5} size="xs"/>
            <Text size="xs">Rating Count</Text>
          </div>
          <Button><Text truncate>฿ 123456789</Text></Button>
        </div>
      </div>
    </>
  )
}
