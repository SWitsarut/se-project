import { Suspense } from "react";
import StaffList from "./StaffList";
import AddStaffModal from "./AddStaffModal";
import { Skeleton } from "@mantine/core";

export default async function StaffManagement() {
  return (
    <>
      <div className="prose">
        <h1>Staff Management</h1>
      </div>

      <div>
        <AddStaffModal />
      </div>

      <Suspense fallback={<Skeleton animate height={400} />}>
        <StaffList />
      </Suspense>
    </>
  )
}
