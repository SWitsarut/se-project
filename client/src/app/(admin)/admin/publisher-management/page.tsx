import { Metadata } from "next";
import TableSection from "./TableSection";
import SearchPublisher from "./SearchPublisher";
import { Suspense } from "react";
import CustomPagination from "./CustomPagination";
import { Skeleton } from "@mantine/core";

export const metadata: Metadata ={
  title: "Publisher Manangement | E-book store"
}

async function getTotalPublisherPage(take: number, page: number, search: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-publisher?action=get-page}&take=${take}&page=${page}&search=${search}`, {
    cache: "no-store"
  });
  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function PublisherManagementPage({
  searchParams,
}: {
  searchParams?: {
    take?: string
    page?: string
    search?: string
  }
}) {
  const take = Number(searchParams?.take) || 20;
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";

  const { totalPage } = await getTotalPublisherPage(take, page, search);
  
  return (
    <>
      <div className="prose">
        <h1>Publisher Management</h1>
      </div>

      <SearchPublisher take={take} search={search}/>

      <Suspense key={search + page + take} fallback={<Skeleton animate={true} height={500} />}>
        <TableSection search={search} take={take} page={page}/>
      </Suspense>

      <CustomPagination page={page} totalPage={totalPage}/>
    </>
  );
}
