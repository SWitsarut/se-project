import prisma from "@/libs/prisma";
import AddBookForm from "./AddBookForm";

export interface BookDetailType {
  genres: string[]
  categories: string[]
  authors: string[]
}

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

export default async function AddBookPage() {
  const bookDetail = await getBookDetail();
  return (
    <>
      <div className="prose">
        <h1>Add book</h1>
      </div>
      <AddBookForm bookDetail={bookDetail}/>
    </>
  )
}
