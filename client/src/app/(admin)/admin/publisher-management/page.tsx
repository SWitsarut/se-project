import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@mantine/core";
import TableSection from "./TableSection";
import CustomPagination from "../_components/CustomPagination";
import SelectTake from "../_components/SelectTake";
import SearchBar from "../_components/SearchBar";
import prisma from "@/libs/prisma";

export const metadata: Metadata ={
  title: "Publisher Manangement | E-book store"
}

async function getTotalPage(take: number, search: string) {
  try {
    const count = await prisma.publisher.count({
      where: {
        publisherName: {
          contains: search
        }
      }
    })

    return Math.ceil(count / take);
  } catch (error) {
    console.log(error);
    return 1;
  }
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

  const totalPage = await getTotalPage(take, search);
  
  return (
    <>
      <div className="prose">
        <h1>Publisher Management</h1>
      </div>

      <div className="flex gap-4">
        <SelectTake />
        <SearchBar label="Search for publisher"/>
      </div>

      <div className="overflow-x-auto">
        <Suspense key={search + page + take} fallback={<Skeleton animate={true} height={400} />}>
          <TableSection search={search} take={take} page={page}/>
        </Suspense>
      </div>
      
      <CustomPagination totalPage={totalPage}/>
    </>
  );
}
