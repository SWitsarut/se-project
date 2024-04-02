import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId, avatar, displayName } = await req.json();

    const session = await getCurrentSession();

    if(!session || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar,
        displayName,
      }
    });

    return NextResponse.json({ message: "Profile updated", avatar: result.avatar, displayName: result.displayName}, { status: 200 });
  } catch (error) {
    console.log("Error at /api/profile/route.ts POST: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500});
  }
}