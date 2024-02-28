import { Suspense } from "react";
import StaffList from "./StaffList";
import AddStaffModal from "./AddStaffModal";

export default async function StaffManagement() {

  return (
    <>
      <div className="prose">
        <h1>Staff Management</h1>
      </div>

      <div>
        <AddStaffModal />
      </div>

      <Suspense fallback={<>Loading...</>}>
        <StaffList />
      </Suspense>
    </>
  )
}
