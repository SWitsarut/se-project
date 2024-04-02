import prisma from "@/libs/prisma"
import { OrderHistoryData } from "@/types/user"
import { Table, TableTbody, TableTh, TableThead, TableTr, Text } from "@mantine/core"
import { PaymentStatus } from "@prisma/client"
import Link from "next/link"

interface OrderHistoryProps {
  userId: string
}

async function getOrderHistory(userId: string): Promise<OrderHistoryData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/profile/${userId}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function OrderHistory({ userId }: OrderHistoryProps) {
  const orders = await getOrderHistory(userId);

  return (
    <div className="w-full border p-4 shadow-lg rounded-md overflow-x-auto">
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Order Id</TableTh>
            <TableTh>Details</TableTh>
            <TableTh>Total Price</TableTh>
            <TableTh>Status</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {orders.map((order) => (
            <TableTr key={order.id}>
              <TableTh>{order.id}</TableTh>
              <TableTh>
                <ul className="px-0 list-none">
                  {order.order.map((book) => (
                    <li className="flex items-center gap-4" key={book.bookIsbn}>
                      <Link target="_blank" href={`/book/${book.bookTitle}`}><Text fw={500} classNames={{ root: "hover:underline" }}>{book.bookTitle}</Text></Link>
                      <Text size="sm" fw={500}>฿ {book.bookPrice}</Text>
                    </li>
                  ))}
                </ul>
              </TableTh>
              <TableTh><Text fw={500}>฿ {order.order.reduce((acc, data) => acc + data.bookPrice, 0)}</Text></TableTh>
              <TableTh>
                <Text fw={500} c={order.status === "SUCCEEDED" ? "green" : "red"}>
                  {order.status}
                </Text>
                {order.status === "SUCCEEDED" && order.paidAt && (
                  <Text size="sm" c="dimmed" fw={500}>Paid at: {new Date(order.paidAt).toDateString()}</Text>
                )}
              </TableTh>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </div>
  )
}
