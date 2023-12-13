import prisma from "@/libs/prisma"
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { userId }}: any) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        servers: {
          select: {
            id: true,
            serverName: true,
            room: {
              select: {
                id: true
              }
            }
          }
        },
      }
    })

    return NextResponse.json( data, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}