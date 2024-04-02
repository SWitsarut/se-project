import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { PieChart } from "@mantine/charts";
import { Center, Paper } from "@mantine/core";
import { redirect } from "next/navigation";
import CommentTable from "./_component/CommentTable";

export default async function PublisherDashboard() {
  const session = await getCurrentSession();

  if (
    !session ||
    !session.user.publisher ||
    session.user.role !== "PUBLISHER"
  ) {
    redirect("/");
  }

  const publishername = session.user.publisher;
  const totalSellingBook = await prisma.book.count({
    where: {
      publisher: { publisherName: session.user.publisher },
      AND: { isSelling: true },
    },
  });
  const totalBook = await prisma.book.count({
    where: { publisher: { publisherName: session.user.publisher } },
  });
  const booksSold = await prisma.bookOwnership.count({
    where: { book: { publisher: { publisherName: session.user.publisher } } },
  });
  // const mostSoldBook = await prisma.bookOwnership.groupBy({
  //   by: ['bookId'],
  //   _count: {
  //     bookId: true
  //   },
  //   orderBy: {
  //     _count: {
  //       bookId: 'desc'
  //     }
  //   },
  //   take: 1
  // });

  // const mostSoldBookName = await prisma.book.findUnique({
  //   where: {
  //     id: bookId
  //   },
  //   select: {
  //     name: true
  //   }
  // });
  const mostSoldBook = await prisma.bookOwnership.groupBy({
    by: ["bookIsbn"],
    where: { book: { publisher: { publisherName: publishername } } },
    _count: { userId: true },
  });

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
    value: Number(item._count.userId),
    color: colorOptions[index % colorOptions.length],
  }));

  // console.log(chartData);
  // console.log(booksSold);
  const comments = await prisma.comment.findMany({
    where: { book: { publisher: { publisherName: publishername } } },
    orderBy: { createdAt: "desc" },
    skip: 0,
    take: 5,
    select: {
      user: { select: { username: true } },
      content: true,
      rating: true,
      createdAt: true,
      book: { select: { title: true } },
    },
  });
  console.log(comments);
  return (
    <>
      <div className="prose">
        <h1>Publisher Dashboard</h1>
      </div>
      <div className="flex flex-row gap-3">
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
                // labelColor="grape"
                w={100}
                h={100}
              />
              <div>
                <div className="w-full max-w-lg flex flex-row justify-between">
                  <h4>Total Book Sold</h4>
                  <h4>{booksSold}</h4>
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
      <div>
        <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
          <Center classNames={{ root: "flex flex-col" }}>
            <h3>Recent comment</h3>
            <CommentTable comments={comments} />
          </Center>
        </Paper>
      </div>
    </>
  );
}
