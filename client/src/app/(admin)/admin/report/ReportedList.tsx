import { Table, TableThead, TableTr, TableTh, TableTbody, TableTd, Text } from "@mantine/core";
import { ReportStatus } from "@prisma/client";
import Link from "next/link";

interface ReportedData {
  id: number
  book: {
    isbn: string
    title: string
  }
  user: {
    username: string
    avatar: string | null
  };
  reason: string
  status: ReportStatus
  createAt: Date
}

async function getReportedLists() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/report`, {
    cache: "no-store"
  });

  return res.json();
}

export default async function ReportedList() {
  const reportedLists = await getReportedLists();
  return (
    <>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <TableThead>
          <TableTr>
            <TableTh>User</TableTh>
            <TableTh>Book</TableTh>
            <TableTh>Reason</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>Reported at</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {reportedLists.map((report: ReportedData) => (
            <TableTr key={report.id}>
              <TableTd>
                <Text>{report.user.username}</Text>
                <Text>{}</Text>
              </TableTd>
              <TableTd>
                <Text size="xs">ISBN: {report.book.isbn}</Text>
                <Link target="_blank" className="hover:underline" href={`/book/${report.book.title}`}><Text>Title: {report.book.title}</Text></Link>
              </TableTd>
              <TableTd>{report.reason}</TableTd>
              <TableTd>{report.status}</TableTd>
              <TableTd>{new Date(report.createAt).toDateString()}</TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
