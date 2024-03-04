import prisma from "@/libs/prisma";
import EditBookForm from "./EditBookForm";
import { BookDetailType, EditBookData } from "@/types/book";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/libs/getCurrentSession";

const getBookDetail = async (): Promise<BookDetailType> => {
  try {
    const genres = await prisma.genre.findMany();
    const categories = await prisma.category.findMany();
    const authors = await prisma.author.findMany();

    return {
      genres: genres.map((genre) => genre.genreName),
      categories: categories.map((category) => category.categoryName),
      authors: authors.map((author) => author.authorName),
    }
  } catch (error) {
    console.log("Error at getBookDetail: ", error);
    return {
      genres: [],
      categories: [],
      authors: []
    };
  }
}

async function getBookData(publisherName: string, isbn: string): Promise<{ book: EditBookData }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/book-management/${isbn}`, {
    cache: "no-store"
  });

  const data = await res.json();
  
  if(data.error) {
    if(res.status === 404) {
      notFound();
    }
    throw new Error(data.error);
  }

  return data;
}

export default async function EditBookPage({
  params: { isbn },
}: {
  params: { isbn: string };
}) {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    redirect("/");
  }

  const bookDetail = await getBookDetail();
  const { book } = await getBookData(session.user.publisher, isbn);

  return (
    <>
      <EditBookForm publisherName={session.user.publisher} bookData={book} bookDetail={bookDetail} />
    </>
  );
}