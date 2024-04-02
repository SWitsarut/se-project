import prisma from "@/libs/prisma";
import { Metadata } from "next";
import { DonutChart } from "@mantine/charts";
import { Center, Loader, Paper } from "@mantine/core";
import { Suspense } from "react";
import ChartSection from "./_component/ChartSection";
import RecentCommentAndOrder from "./_component/RecentCommentAndOrder";

export const metadata: Metadata = {
  title: "Admin Dashboard | E-book store",
};

export default async function AdminDashboard() {;
  return (
    <>
      <div className="prose">
        <h1>Admin Dashboard</h1>
      </div>
      
      <Suspense fallback={<div className="flex h-[300px] justify-center items-center"><Loader size="xl"/></div>}>
        <ChartSection />
      </Suspense>

      <Suspense fallback={<div className="flex h-[300px] justify-center items-center"><Loader size="xl"/></div>}>
        <RecentCommentAndOrder />
      </Suspense>
    </>
  );
}
