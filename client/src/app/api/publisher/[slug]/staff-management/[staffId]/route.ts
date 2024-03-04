import prisma from "@/libs/prisma";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params: { slug, staffId } }: { params: { slug: string, staffId: string } },
) => {
  const session = await getCurrentSession();

  if(!session || !session.user.publisher || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if(session.user.publisher !== slug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const isManager = await prisma.publisher.findUnique({
      where: {
        publisherName: session.user.publisher,
        managerId: session.user.id
      }
    })

    if(!isManager) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.publisher.update({
      where: {
        publisherName: slug,
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
    console.log("Error at /api/publisher/[slug]/staff-management/[staffId] PATCH", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
