import { DonutChart } from "@mantine/charts"
import { Center, Paper } from "@mantine/core"

interface ChartData {
  userCount: number
  adminCount: number
  publisherCount: number
  totalOrder: number
  totalBook: number
}

async function getDashboardData(): Promise<ChartData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin`, {
    cache: "no-store"
  });

  return response.json();
}

export default async function ChartSection() {
  const data = await getDashboardData();

  const totalCount = data.userCount + data.adminCount + data.publisherCount;
  const totalUser = [
    { name: "User", value: data.userCount, color: "indigo.6" },
    { name: "Admin", value: data.adminCount, color: "red.6" },
    { name: "Publisher", value: data.publisherCount, color: "yellow.6" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-3">
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
                  <h4>Total User</h4>
                  <h4>{totalCount}</h4>
                </div>
              </div>
            </div>
          </Center>
        </Paper>
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>total Book</h3>
            <h1>{data.totalBook}</h1>
          </Center>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>total Order</h3>
            <h1>{data.totalOrder}</h1>
          </Center>
        </Paper>
      </div>
  )
}