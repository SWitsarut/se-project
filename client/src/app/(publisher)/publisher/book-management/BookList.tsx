import { BookResponse } from "@/types/book";
import { Button, HoverCard, HoverCardDropdown, HoverCardTarget, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "./DeleteModal";
import { BASE_URL } from "@/utils";

interface BookListProps {
  publisherName: string
}

async function getBookList(publisherName: string): Promise<{ books: BookResponse[] }> {
  const res = await fetch(`${BASE_URL}/api/publisher/${publisherName}/book-management`, {
    cache: "no-store",
  });

  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function BookList({ publisherName }: BookListProps) {
  const { books } = await getBookList(publisherName);

  return (
    <>
      <Table layout="auto" striped highlightOnHover withTableBorder withColumnBorders>
        <TableThead>
          <TableTr>
            <TableTh>ISBN</TableTh>
            <TableTh>Title</TableTh>
            <TableTh>Price</TableTh>
            <TableTh>Category</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>CreatedAt</TableTh>
            <TableTh>Actions</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {books.map((book) => (
            <TableTr key={book.isbn}>
              <TableTd>{book.isbn}</TableTd>
              <TableTd className="hover:underline">
                <HoverCard position="left">
                  <HoverCardTarget>
                    <Link href={`/book/${book.title}`} target="_blank">
                      {book.title}
                    </Link>
                  </HoverCardTarget>
                  <HoverCardDropdown>
                    <div className="w-24 aspect-[1/1.414] relative">
                      <Image
                        className="w-full h-full"
                        src={book.cover}
                        alt={book.title}
                        fill
                        priority
                      />
                    </div>
                  </HoverCardDropdown>
                </HoverCard>
              </TableTd>
              <TableTd>฿ {book.price}</TableTd>
              <TableTd>{book.category}</TableTd>
              <TableTd>{book.isSelling ? <Text c="green">Selling</Text> : <Text c="red">Closing</Text>}</TableTd>
              <TableTd>{book.createdAt}</TableTd>
              <TableTd>
                <div className="flex gap-4">
                  <Link href={`book-management/edit/${book.isbn}`}>
                    <Button leftSection={<IconPencil />}>Edit</Button>
                  </Link>
                  <DeleteModal publisherName={publisherName} isbn={book.isbn} title={book.title} />
                </div>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
