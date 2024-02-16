import { Suspense } from "react";
import PublisherList from "./PublisherList";

export default function PublisherManagementPage({
  searchParams,
}: {
  searchParams?: {
    take?: string
    page?: string
  }
}) {
  const take = Number(searchParams?.take) || 5;
  const page = Number(searchParams?.page) || 1;
  return (
    <>
      <Suspense key={take + page} fallback={<>loading</>}>
        <PublisherList take={take} page={page}/>
      </Suspense>
    </>
  );
}
