import prisma from "@/libs/prisma"
import { NextResponse } from "next/server";

export const GET = async (req: Request, {params: { serverId }}: any) => {
  const userId = new URL(req.url).searchParams.get("userid") as string;
  try {
    const serverData = await prisma.server.findUnique({
      where: {
        id: serverId,
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        room: true,
        users: {
          select: {
            displayName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(serverData, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal server", { status: 500 })
  }
}