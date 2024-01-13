import { Badge, Button, Text } from "@mantine/core";
import Image from "next/image";

export default function BookPage({
  params: { bookname },
}: {
  params: { bookname: string };
}) {
  return (
    <div className="flex flex-col gap-16 px-4 w-full max-w-7xl">
      <div className="w-full text-center">
        <h1>{bookname}</h1>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Image
            src={`https://cdn-local.mebmarket.com/meb/server1/265529/Thumbnail/book_detail_large.gif?2`}
            alt={"book_cover"}
            height={0}
            width={0}
            sizes="100vw"
            className="w-72 h-full aspect-[1/1.414] shadow-lg border"
          />
        </div>
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <Text fw={700}>author: <Text span>authorName</Text></Text>
            <Text fw={700}>publisher: <Text span>publisherName</Text></Text>
            <Text fw={700}>category: <Text span>categoryName</Text></Text>
          </div>
          <div>
            <Button size="lg" radius="xl">฿ 123</Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline">Genres</Badge>
        <Badge variant="outline">Genres</Badge>
        <Badge variant="outline">Genres</Badge>
        <Badge variant="outline">Genres</Badge>
      </div>

      <div className="w-full break-words">
        Lorem ipsum dolor sit amet,consectetur adipisicing elit. Quia ea praesentium recusandae in ipsam. Pariatur architecto asperiores quia dolore numquam perferendis autem aliquid voluptatem, officiis hic, quisquam minus! Quaerat, aliquid nesciunt aspernatur officiis asperiores voluptas quasi autem veniam perspiciatis voluptatibus, nobis dolor doloremque ipsa repellendus esse dolore optio at possimus.
      </div>
    </div>
  );
}
