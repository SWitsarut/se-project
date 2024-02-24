import { BookResponse } from "@/types/book";
import { HoverCard, HoverCardDropdown, HoverCardTarget, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface BookListProps {
  slug: string
  page: number
  take: number
  search: string
}

async function getBookList(slug: string, page: number, take: number, search: string): Promise<{ books: BookResponse[] }> {
  const searchParams = `?page=${page}&take=${take}&search=${search}`
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-book-by-publisher/${slug}${searchParams}`, {
    cache: "no-store",
  })

  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function BookList({ slug, page, take, search }: BookListProps) {
  const { books } = await getBookList(slug, page, take, search);
  
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
                    />
                  </HoverCardDropdown>
                </HoverCard>
              </TableTd>
              <TableTd>{book.price}</TableTd>
              <TableTd>{book.category}</TableTd>
              <TableTd>{book.isSelling ? <Text c="green">Selling</Text> : <Text c="red">Closing</Text>}</TableTd>
              <TableTd>{book.createdAt}</TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
