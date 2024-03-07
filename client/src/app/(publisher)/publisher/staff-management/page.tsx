import StaffList from "./StaffList";
import AddStaffModal from "./AddStaffModal";
import { Suspense } from "react";
import { Skeleton } from "@mantine/core";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

export default async function StaffManagementPage() {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    redirect("/")
  }

  return (
    <>
      <div className="prose">
        <h1>Staff Management</h1>
      </div>
      
      <div>
        <AddStaffModal publisherName={session.user.publisher} />
      </div>

      <div className="overflow-x-auto">
        <Suspense fallback={<Skeleton animate height={400} />}>
          <StaffList staffId={session.user.id} publisherName={session.user.publisher}/>
        </Suspense>
      </div>
    </>
  )
}
