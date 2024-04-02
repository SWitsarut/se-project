import { PieChart } from "@mantine/charts"
import { Center, Paper } from "@mantine/core"

interface ChartSectionProps {
  publisherName: string
}

interface PublisherDashboardResponse {
  totalSellingBook: number
  totalBook: number
  bookSold: number
  mostSoldBook: {
    bookIsbn: string
    count: number
  }[]
}

async function getPublisherData(publisherName: string): Promise<PublisherDashboardResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}`, {
    cache: "no-store"
  });

  if(!res.ok) throw new Error("Failed to publisher data");

  return res.json();
}

export default async function ChartSection({ publisherName }: ChartSectionProps) {
  const { totalSellingBook, totalBook, bookSold, mostSoldBook } = await getPublisherData(publisherName);

  const colorOptions = [
    "red.6",
    "gray.6",
    "pink.6",
    "grape.6",
    "violet.6",
    "indigo.6",
    "blue.6",
    "cyan.6",
    "teal.6",
    "green.6",
    "lime.6",
    "yellow.6",
    "orange.6",
  ];

  const chartData = mostSoldBook.map((item, index) => ({
    name: item.bookIsbn,
    value: Number(item.count),
    color: colorOptions[index % colorOptions.length],
  }));

  return (
    <>
      <div className="grid md:grid-cols-2 gap-3">
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>User ratio</h3>
            <div>
              <PieChart
                data={chartData}
                withTooltip
                tooltipDataSource="segment"
                mx="auto"
                withLabelsLine
                withLabels
                w={100}
                h={100}
              />
              <div>
                <div className="w-full max-w-lg flex flex-row justify-between">
                  <h4>Total Book Sold</h4>
                  <h4>{bookSold}</h4>
                </div>
              </div>
            </div>
          </Center>
        </Paper>
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>Total Selling Books</h3>
            <h1>{totalSellingBook}</h1>
            <h3>Total register Books</h3>
            <h1>{totalBook}</h1>
          </Center>
        </Paper>
      </div>
    </>
  )
}
