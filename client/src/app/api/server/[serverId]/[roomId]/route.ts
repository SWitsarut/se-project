import prisma from "@/libs/prisma"
import { NextResponse } from "next/server";

export const GET = async (req: Request, {params: { serverId ,roomId }}: any) => {
  try {
    const data = await prisma.room.findUnique({
      where: {
        serverId,
        id: roomId,
      },
      select: {
        messages: {
          select: {
            message: true,
            picture: true,
            user: {
              select: {
                displayName: true,
                email: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json(data ,{ status: 200 })
  } catch (error) {
    console.log(error)
  }
}