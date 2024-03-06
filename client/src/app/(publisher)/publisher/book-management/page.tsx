import { getCurrentSession } from "@/libs/getCurrentSession";
import { Button, Skeleton } from "@mantine/core";
import Link from "next/link";
import BookList from "./BookList";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ManageBookPage() {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER"){
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

      <div className="overflow-x-auto">
        <Suspense fallback={<Skeleton height={400}/>}>
          <BookList publisherName={session.user.publisher}/>
        </Suspense>
      </div>
    </>
  )
}
