import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/session";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params: { staffId } }: { params: { staffId: string } },
) => {
  const user = await getCurrentUser();

  if(!user || !user.publisher) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const isManager = await prisma.publisher.findUnique({
      where: {
        publisherName: user.publisher,
        managerId: user.id
      }
    })

    if(!isManager) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.publisher.update({
      where: {
        publisherName: user.publisher,
      },
      data: {
        staffs: {
          update: {
            where: {
              id: staffId,
            },
            data: {
              role: "USER",
            }
          },
          disconnect: {
            id: staffId,
          },
        },
      }
    });

    return NextResponse.json({ message: "Remove from publisher successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/manage/staff/staffId PATCH", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
