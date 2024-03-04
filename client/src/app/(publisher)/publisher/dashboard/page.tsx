import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function PublisherDashboard() {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher  || session.user.role !== "PUBLISHER") {
    redirect("/");
  }

  return (
    <div>
      Publisher Dashboard
    </div>
  )
}