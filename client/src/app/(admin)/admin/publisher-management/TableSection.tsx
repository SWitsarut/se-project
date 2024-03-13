
import { PublisherResponse } from "@/types/publisher";
import { BASE_URL } from "@/utils";
import { Button, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import Link from "next/link";

interface TableSectionProps {
  take: number
  page: number
  search: string
}

async function getPublisher(take: number, page: number, search: string): Promise<{ publishers: PublisherResponse[] }> {
  const searchParams = new URLSearchParams({ take: take.toString(), page: page.toString(), search });
  
  const res = await fetch(`${BASE_URL}/api/admin/publisher-management?` + searchParams, {
    cache: "no-store"
  });
  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

export default async function TableSection({ take, page, search }: TableSectionProps) {
  const { publishers } = await getPublisher(take, page, search);

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <TableThead>
        <TableTr>
          <TableTh>ID</TableTh>
          <TableTh>Publisher name</TableTh>
          <TableTh>Total book</TableTh>
          <TableTh>Total staff</TableTh>
          <TableTh>Actions</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {publishers.map((publisher) => (
          <TableTr key={publisher.id}>
            <TableTd>{publisher.id}</TableTd>
            <TableTd>{publisher.publisherName}</TableTd>
            <TableTd>{publisher.totalBook}</TableTd>
            <TableTd>{publisher.totalStaff}</TableTd>
            <TableTd>
              <Link href={`/admin/publisher-management/${publisher.publisherName}`}>
                <Button size="sm" >View Publisher</Button>
              </Link>
            </TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  )
}
