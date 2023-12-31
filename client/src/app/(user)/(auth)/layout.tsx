import { authOption } from "@/libs/authOption";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode}) {
  const session = await getServerSession(authOption);
  
  if(session) {
    redirect("/");
  }

  return (
    <>
      {children}
    </>
  )
}
