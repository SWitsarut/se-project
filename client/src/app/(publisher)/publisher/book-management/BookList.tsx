import { BookResponse } from "@/types/book";
import { Button, HoverCard, HoverCardDropdown, HoverCardTarget, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "./DeleteModal";

interface BookListProps {
  publisherName: string
}

async function getBookList(publisherName: string): Promise<{ books: BookResponse[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/book-management`, {
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
      <Table striped highlightOnHover withTableBorder withColumnBorders>
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
                    <Image
                      className="w-auto h-40 aspect-[1/1.414]"
                      src={book.cover}
                      width={0}
                      height={0}
                      alt="book_cover"
                      sizes="100vw"
                      priority
                    />
                  </HoverCardDropdown>
                </HoverCard>
              </TableTd>
              <TableTd>{book.price}</TableTd>
              <TableTd>{book.category}</TableTd>
              <TableTd>{book.isSelling ? <Text c="green">Selling</Text> : <Text c="red">Closing</Text>}</TableTd>
              <TableTd>{book.createdAt}</TableTd>
              <TableTd>
                <div className="space-x-4">
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
