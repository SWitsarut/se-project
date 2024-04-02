import { getCurrentSession } from "@/libs/getCurrentSession";
import { Center, Loader, Paper } from "@mantine/core";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChartSection from "./_component/ChartSection";
import CommentTable from "./_component/CommentTable";

export default async function PublisherDashboard() {
  const session = await getCurrentSession();

  if(!session || session.user.role !== "PUBLISHER" || !session.user.publisher) {
    redirect("/login");
  }

  return (
    <>
      <div className="prose">
        <h1>Publisher Dashboard</h1>
      </div>
      
      <Suspense fallback={<div className="flex h-[300px] justify-center items-center"><Loader size="xl"/></div>}>
        <ChartSection publisherName={session.user.publisher} />
      </Suspense>

      <div>
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>Recent comment</h3>
          </Center>
          <Suspense fallback={<div className="flex h-[300px] justify-center items-center"><Loader size="xl"/></div>}>
            <CommentTable publisherName={session.user.publisher}/>
          </Suspense>
        </Paper>
      </div>
    </>
  );
}
