import { getCurrentSession } from "@/libs/getCurrentSession";
import BookShelf from "./BookShelf";

export default async function MyBookShelfPage() {
  const session = await getCurrentSession();
  
  return (
    <>
      <div className="prose mx-auto text-center">
        <h1>Bookshelf</h1>
      </div>

      <div className="px-2 flex flex-col gap-4 w-full max-w-4xl mx-auto">
        <div className="border-b-2">
          <h3>Bookshelf</h3>
        </div>
        {session ? (
          <BookShelf userId={session.user.id}/>
        ) : (
          <div className="flex justify-center w-full max-w-3xl">
            <p>You need to login to see your bookshelf</p>
          </div>
        )}  
      </div>
    </>
  )
}