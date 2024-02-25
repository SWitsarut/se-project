import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/session";

export default async function AdminLayout({ children }: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  if(!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Sidebar>
      {children}
    </Sidebar>
  )
}
