import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode}) {
  const session = await getCurrentSession();
  
  if(session) {
    redirect("/");
  }

  return (
    <>
      {children}
    </>
  )
}
