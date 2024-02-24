import Sidebar from "@/components/Sidebar";
import { authOption } from "@/libs/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default async function PublisherAdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOption);
  
  if(!session || session.user.role !== "PUBLISHER") {
    redirect("/");
  }
  return (
    <Sidebar session={session}>
      <Notifications />
      {children}
    </Sidebar>
  )
}
