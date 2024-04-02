import { Skeleton } from "@mantine/core";
import { Suspense } from "react";
import ReportedList from "./ReportedList";

export default function ReportPage() {
  return (
    <>
      <div className="prose">
        <h1>Report</h1>
      </div>

      <Suspense fallback={<Skeleton animate={true} height={400} />}>
        <ReportedList />
      </Suspense>
    </>
  )
}
