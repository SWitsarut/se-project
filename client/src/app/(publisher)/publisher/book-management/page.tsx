import { getCurrentUser } from "@/libs/session";
import { Button, Skeleton } from "@mantine/core";
import Link from "next/link";
import BookList from "./BookList";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ManageBookPage() {
  const user = await getCurrentUser();

  if(!user || !user.publisher || user.role !== "PUBLISHER"){
    redirect("/");
  }

  return (
    <>
      <div className="prose">
        <h1>Book Management</h1>
      </div>

      <div>
        <Link href={"/publisher/book-management/new"}>
          <Button>Add book</Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton height={400}/>}>
        <BookList publisherName={user.publisher}/>
      </Suspense>
    </>
  )
}
