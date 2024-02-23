import { Suspense } from "react";
import UserList from "./UserList";

export default function UserManagementPage() {
  return (
    <>
      <div className="prose">
        <h1>User Management</h1>
      </div>

      <Suspense fallback={<>Loading...</>}>
        <UserList />
      </Suspense>
    </>
  );
}
