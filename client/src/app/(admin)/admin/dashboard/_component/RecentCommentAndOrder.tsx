import { Avatar, Paper, Rating, Text } from "@mantine/core";

interface CommentData {
  id: string
  user: {
    displayName: string
    avatar: string | null
  }
  bookTitle: string
  content: string
  rating: number
  date: Date
}

interface OrderData {
  id: number
  user: {
    displayName: string
    avatar: string | null
  };
  bookTitle: string
  paidAt: Date | null
  listItem: {
    bookTitle: string
    bookPrice: number
  }[]
  totalPrice: number
}

async function getRecentComment(): Promise<CommentData[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/comment`, {
    cache: "no-store"
  });

  return response.json();
}

async function getRecentOrder(): Promise<OrderData[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/order`, {
    cache: "no-store"
  });

  return response.json();
}

export default async function RecentCommentAndOrder() {
  const comments = await getRecentComment();
  const orders = await getRecentOrder();
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
        <div>
          <h3>Recent Comment</h3>
          <div className="flex flex-col gap-1">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-2 p-2 border rounded-md">                
                <div className="flex justify-between">
                  <Text size="sm">from book {comment.bookTitle}</Text>
                  <Text c="dimmed" size="xs">at {new Date(comment.date).toDateString()}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Avatar size="sm" src={comment.user.avatar}/>
                    <Text size="sm">{comment.user.displayName}</Text>
                  </div>
                  <Rating fractions={2} value={comment.rating} />
                </div>
                <div>
                  <Text>{comment.content}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
      <Paper shadow="lg" p="xs" classNames={{ root: "w-full" }}>
        <div>
          <h3>Recent Order</h3>
          <div className="flex flex-col gap-1">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-2 p-2 border rounded-md">
                <div className="flex justify-between">
                  <Text size="sm">Order Id {order.id}</Text>
                  {order.paidAt && <Text c="dimmed" size="xs">at {new Date(order.paidAt).toDateString()}</Text>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Avatar size="sm" src={order.user.avatar}/>
                    <Text size="sm">{order.user.displayName}</Text>
                  </div>
                  <Text size="sm">Total: ฿ {order.totalPrice}</Text>
                </div>
                <div>
                  {order.listItem.map((item) => (
                    <div key={item.bookTitle} className="flex gap-4">
                      <Text size="sm">{item.bookTitle}</Text>
                      <Text size="sm">฿ {item.bookPrice}</Text>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
        </div>
      </Paper>
    </div>
  )
}
