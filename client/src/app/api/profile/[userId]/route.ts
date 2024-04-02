import prisma from "@/libs/prisma";
import { OrderHistoryData } from "@/types/user";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: { params: { userId: string }}) => {
  try {
    const orders: OrderHistoryData[] = await prisma.userOrder.findMany({
      where: {
        order: {
          every: {
            userId
          },
        },
        status: {
          in: ["SUCCEEDED", "FAILED"],
        }
      },
      select: {
        id: true,
        paidAt: true,
        status: true,
        order: {
          select: {
            bookPrice: true,
            bookTitle: true,
            bookIsbn: true,
          }
        },
      }
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log("Error at /api/profile/[userId]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}