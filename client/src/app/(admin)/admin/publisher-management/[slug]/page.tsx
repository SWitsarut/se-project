import prisma from "@/libs/prisma";
import { notFound } from "next/navigation";
import BookList from "./BookList";
import { Suspense } from "react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import ManagerList from "./ManagerList";

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

export default async function SinglePublisherPage({ params }: { params: { slug: string }}) {
  await getPublisher(params.slug);

  return (
    <>
      <div className="prose">
        <h1>{params.slug}</h1>
      </div>

      <Tabs>
        <TabsList grow>
          <TabsTab value="books">
            Books
          </TabsTab>
          <TabsTab value="managers">
            Managers
          </TabsTab>
        </TabsList>

        <TabsPanel value="books">
          <Suspense key={params.slug} fallback={<>Loading...</>}>
            <BookList slug={params.slug}/> 
          </Suspense>
        </TabsPanel>
        <TabsPanel value="managers">
          <Suspense key={params.slug} fallback={<>Loading...</>}>
            <ManagerList slug={params.slug}/> 
          </Suspense>
        </TabsPanel>
      </Tabs>
    </>
  )
}
