import Checkout from "./Checkout";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getCurrentSession();

  if(!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="prose w-full max-w-4xl mx-auto text-center my-8">
        <h1>Checkout</h1>
      </div>

      <Checkout />
    </>
  )
}