import prisma from "@/libs/prisma";
import { Metadata } from "next";
import { DonutChart, PieChart } from "@mantine/charts";
import { Box, Center, Paper } from "@mantine/core";
import { root } from "postcss";

export const metadata: Metadata = {
  title: "Admin Dashboard | E-book store",
};

export default async function AdminDashboard() {
  const userCount = await prisma.user.count({ where: { role: "USER" } });
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const publisherCount = await prisma.user.count({
    where: { role: "PUBLISHER" },
  });
  const totalCount = userCount + adminCount + publisherCount;
  const totalUser = [
    { name: "User", value: userCount, color: "indigo.6" },
    { name: "Admin", value: adminCount, color: "red.6" },
    { name: "Publisher", value: publisherCount, color: "yellow.6" },
  ];
  const totalBook = await prisma.book.count();
  console.log(totalUser);
  return (
    <>
      <div className="prose">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="flex flex-row gap-3">
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>User ratio</h3>
            <div>
              <DonutChart
                data={totalUser}
                withTooltip
                tooltipDataSource="segment"
                mx="auto"
                withLabelsLine
                withLabels
                labelColor="grape"
                w={100}
                h={100}
              />
              <div>
                <div className="w-full max-w-lg flex flex-row justify-between">
                  <h4>Total Book</h4>
                  <h4>{totalBook}</h4>
                </div>
              </div>
            </div>
          </Center>
        </Paper>
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>total Book</h3>
            <h1>{totalBook}</h1>
          </Center>
        </Paper>
      </div>
    </>
  );
}
