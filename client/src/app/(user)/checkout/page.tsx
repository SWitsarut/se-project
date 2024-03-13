import Checkout from "./Checkout";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getCurrentSession();

  if(!session) {
    redirect("/login");
  }

  return (
    <Checkout />
  )
}