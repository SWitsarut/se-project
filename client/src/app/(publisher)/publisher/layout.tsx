import Sidebar from "@/components/Sidebar";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function PublisherAdminLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    redirect("/");
  }

  return (
    <Sidebar>
      {children}
    </Sidebar>
  )
}
