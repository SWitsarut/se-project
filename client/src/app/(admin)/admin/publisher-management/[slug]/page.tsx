import prisma from "@/libs/prisma";
import { notFound } from "next/navigation";
import BookList from "./BookList";
import { Suspense } from "react";
import SelectTabs from "./SelectTabs";
import { Skeleton } from "@mantine/core";
import SearchBar from "../../_components/SearchBar";
import SelectTake from "../../_components/SelectTake";
import CustomPagination from "../../_components/CustomPagination";
import StaffList from "./StaffList";

export async function generateMetadata({ params: { slug } }: { params: { slug: string }}) {
  return {
    title: `${decodeURIComponent(slug)}`,
  }
}

async function getPublisher(slug: string) {
  const result = await prisma.publisher.findUnique({
    where: {
      publisherName: slug,
    },
  })

  if(!result) {
    notFound();
  }
}

async function getTotalPage(slug: string, tab: string | undefined, take: number, search: string) {
  try {
    if(tab == "book") {
      const count = await prisma.book.count({
        where: {
          publisher: {
            publisherName: slug
          },
          title: {
            contains: search
          }
        },
      })
      
      return Math.ceil(count / take);
    } else {
      const count = await prisma.user.count({
        where: {
          publisher: {
            publisherName: slug
          },
          username: {
            contains: search
          }
        }
      })

      return Math.ceil(count / take);
    }
  } catch (error) {
    console.log(error);
    return 1;
  }
}

export default async function SinglePublisherPage({
  params,
  searchParams 
} : {
  params: { slug: string },
  searchParams: { tab?: string, page?: string, take?: string, search?: string }
}) {
  const slug = decodeURIComponent(params.slug);
  await getPublisher(slug)
  
  const tab = searchParams.tab;
  const take = Number(searchParams?.take) || 20;
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const totalPage = await getTotalPage(slug, tab, take, search);

  return (
    <>
      <div className="prose">
        <h1>{decodeURIComponent(slug)}</h1>
      </div>

      <SelectTabs />
      
      {tab === "staff" ? (
        <Suspense key={tab + page + take + search} fallback={<Skeleton animate={true} height={400} />}>
          <div className="flex gap-4">
            <SelectTake />
            <SearchBar label="Search for staff"/>
          </div>
          <StaffList slug={slug} page={page} take={take} search={search}/> 
          <CustomPagination totalPage={totalPage}/>
        </Suspense>
      ) : (
        <Suspense key={String(tab) + page + take + search} fallback={<Skeleton animate={true} height={400} />}>
          <div className="flex gap-4">
            <SelectTake />
            <SearchBar label="Search for book"/>
          </div>
          <BookList slug={slug} page={page} take={take} search={search}/>
          <CustomPagination totalPage={totalPage}/>
        </Suspense>
      )}
    </>
  )
}
