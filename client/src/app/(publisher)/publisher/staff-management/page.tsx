import { Suspense } from "react";
import StaffList from "./StaffList";
import AddStaffModal from "./AddStaffModal";
import { Skeleton } from "@mantine/core";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function StaffManagement() {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    redirect("/");
  }

  return (
    <>
      <div className="prose">
        <h1>Staff Management</h1>
      </div>
      
      <div>
        <AddStaffModal publisherName={session.user.publisher} />
      </div>

      <Suspense fallback={<Skeleton animate height={400} />}>
        <StaffList staffId={session.user.id} publisherName={session.user.publisher} />
      </Suspense>
    </>
  )
}
