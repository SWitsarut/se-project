import { getCurrentSession } from "@/libs/getCurrentSession";
import WishList from "./WishList";

export default async function MyWishListPage() {
  const session = await getCurrentSession();
  return (
    <>
      <div className="prose mx-auto text-center">
        <h1>Wishlists</h1>
      </div>

      <div className="px-2 flex flex-col gap-4 w-full max-w-5xl mx-auto">
        <div className="border-b-2">
          <h3>Wishlists</h3>
        </div>
        {session ? (
          <WishList userId={session.user.id}/>
        ) : (
          <div className="flex justify-center w-full max-w-3xl">
            <p>You need to login to see your wishlists</p>
          </div>
        )}  
      </div>
    </>
  )
}
