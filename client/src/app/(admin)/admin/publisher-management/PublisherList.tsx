import { Book, Publisher } from "@prisma/client";
import CustomPagination from "./CustomPagination";

export interface PublisherResponse {
  publishers: { 
    id: string; 
    publisherName: string; 
    book: Book[]; 
  }[];
  totalPage: number;
}

async function getPublisher(take: number, page: number): Promise<PublisherResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-publisher?take=${take}&page=${page}`, {
    cache: "no-store"
  });
  const data = await res.json();
  
  if(data.error) {
    throw Error(data.error)
  }
  
  return data;
}

export default async function PublisherList({
  take, page
}: {
  take: number
  page: number
}) {
  const { publishers, totalPage } = await getPublisher(take, page);
  
  return (
    <>
      {publishers.map((publisher) => (
        <div key={publisher.id}>{publisher.publisherName}</div>
      ))}
      <CustomPagination totalPage={totalPage} page={page} />
    </>
  )
}
