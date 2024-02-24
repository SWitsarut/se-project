import prisma from "@/libs/prisma";
import { notFound } from "next/navigation";
import BookList from "./BookList";
import { Suspense } from "react";
import ManagerList from "./ManagerList";
import SelectTabs from "./SelectTabs";

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

export default async function SinglePublisherPage({ params, searchParams }: { params: { slug: string }, searchParams: { tab?: string }}) {
  await getPublisher(params.slug);
  const tab = searchParams.tab || "";

  return (
    <>
      <div className="prose">
        <h1>{params.slug}</h1>
      </div>

      <SelectTabs tab={tab}/>
      
      {tab=== "manager" ? (
        <>
          <Suspense key={params.slug} fallback={<>Loading...</>}>
            <ManagerList slug={params.slug}/> 
          </Suspense>
        </>
      ):(
        <Suspense key={params.slug} fallback={<>Loading...</>}>
          <BookList slug={params.slug}/> 
        </Suspense>
      )}
    </>
  )
}
