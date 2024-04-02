import {
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

interface CommentTableProps {
  publisherName: string;
}

interface CommentData {
  title: string;
  username: string;
  rating: number;
  content: string;
  date: Date;
}

async function getComments(publisherName: string): Promise<CommentData[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/comment`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch comments");

  return res.json();
}

export default async function CommentTable({
  publisherName,
}: CommentTableProps) {
  const comments = await getComments(publisherName);
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
            <TableTh>Book title</TableTh>
            <TableTh>User</TableTh>
            <TableTh>Rating</TableTh>
            <TableTh>Content</TableTh>
            <TableTh>Date</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {comments.map((comment, index) => (
            <TableTr key={index}>
              <TableTd>
                <Link
                  key={index}
                  href={`/book/${comment.title}`}
                  target="_blank"
                  className="hover:underline"
                >
                  {comment.title}
                </Link>
              </TableTd>
              <TableTd>{comment.username}</TableTd>
              <TableTd>
                <Rating fractions={2} value={comment.rating} readOnly />
              </TableTd>
              <TableTd>{comment.content}</TableTd>
              <TableTd>{new Date(comment.date).toLocaleDateString()}</TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </div>
  );
}
