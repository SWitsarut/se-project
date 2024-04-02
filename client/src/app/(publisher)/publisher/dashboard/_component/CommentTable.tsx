import {
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  Rating,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

type Comment = {
  content: string;
  user: {
    username: string;
  };
  book: {
    title: string;
  };
  createdAt: Date;
  rating: number;
};

type tableProps = {
  comments: Comment[];
};

export default function CommentTable(props: tableProps) {
  const { comments } = props;
  return (
    <div className="w-full">
      <Table
        layout="auto"
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <TableThead>
          <TableTr>
            <TableTh>title</TableTh>
            <TableTh>user</TableTh>
            <TableTh>rating</TableTh>
            <TableTh>content</TableTh>
            <TableTh>date</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {comments.map((comment, index) => (
            <TableTr key={index}>
              <TableTd>
                <Link
                  key={index}
                  href={`/book/${comment.book.title}`}
                  target="_blank"
                >
                  {comment.book.title}
                </Link>
              </TableTd>
              <TableTd>{comment.user.username}</TableTd>
              <TableTd>
                <Rating fractions={2} value={comment.rating} readOnly />
                {/* {comment.rating} */}
              </TableTd>
              <TableTd>{comment.content}</TableTd>
              <TableTd>{String(comment.createdAt).substring(0, 10)}</TableTd>
              {/* <TableTd className="hover:underline">
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
              </TableTd> */}
              {/* <TableTd>
                {book.isSelling ? (
                  <Text c="green">Selling</Text>
                ) : (
                  <Text c="red">Closing</Text>
                )}
              </TableTd> */}
              {/* <TableTd>{book.createdAt}</TableTd> */}
              {/* <TableTd>
                <div className="flex gap-4">
                  <Link href={`book-management/edit/${book.isbn}`}>
                    <Button leftSection={<IconPencil />}>Edit</Button>
                  </Link>
                  <DeleteModal
                    publisherName={publisherName}
                    isbn={book.isbn}
                    title={book.title}
                  />
                </div>
              </TableTd> */}
              {/* // </Link> */}
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </div>
  );
}
