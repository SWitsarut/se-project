import Sidebar from "@/components/Sidebar";
import { authOption } from "@/libs/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout() {
  const session = await getServerSession(authOption);

  if(!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Sidebar session={session}>
      <div>AdminLayout</div>
    </Sidebar>
  )
}
