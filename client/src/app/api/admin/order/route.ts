import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const result = await prisma.userOrder.findMany({
      where: {
        status: "SUCCEEDED"
      },
      include: {
        order: {
          include: {
            book: true,
            user: true,
          }
        }
      },
      take: 5,
      orderBy: {
        paidAt: "desc",
      }
    });

    const orders = result.map((order) => ({
      id: order.id,
      user: {
        displayName: order.order[0].user.displayName,
        avatar: order.order[0].user.avatar,
      },
      bookTitle: order.order[0].book.title,
      paidAt: order.paidAt,
      listItem: order.order.map((item) => ({ bookTitle: item.book.title, bookPrice: item.book.price })),
      totalPrice: order.order.reduce((acc, curr) => acc + curr.bookPrice, 0)
    }));

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}