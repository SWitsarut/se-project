import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/libs/session";
import { redirect } from "next/navigation";

export default async function PublisherAdminLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const user = await getCurrentUser();
  
  if(!user || user.role !== "PUBLISHER") {
    redirect("/");
  }
  
  return (
    <Sidebar>
      {children}
    </Sidebar>
  )
}
