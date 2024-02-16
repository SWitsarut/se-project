import { Publisher } from "@prisma/client";
import CustomPagination from "./CustomPagination";

async function getPublisher(take: number, page: number): Promise<{publishers: Publisher[], totalPage: number}> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-publisher?take=${take}&page=${page}`, {
      cache: "no-store"
    });

    if(!res.ok) {
      throw new Error("Error at getPublisher")
    }
    
    return res.json();
  } catch (error) {
    console.log(error);
    return { publishers: [], totalPage: 0 };
  }
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
