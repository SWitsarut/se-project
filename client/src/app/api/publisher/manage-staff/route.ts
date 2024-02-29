import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/session";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const user = await getCurrentUser();

  if(!user || !user.publisher) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const isManager = await prisma.publisher.findUnique({
      where: {
        managerId: user.id,
        publisherName: user.publisher,
      }
    })
  
    if(!isManager) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { username, email } = await req.json(); 

    const userExisting = await prisma.user.findFirst({
      where: {
        AND: [
          { username: username.toLowerCase() },
          { email: email.toLowerCase() },
        ]
      }
    });

    if(!userExisting) {
      return NextResponse.json({ error: "Not found user" }, { status: 400 });
    }

    const userIsInPublisher = await prisma.publisher.findFirst({
      where: {
        staffs: {
          some: {
            id: userExisting.id
          }
        }
      }
    })

    if(userIsInPublisher) {
      return NextResponse.json({ error: "The user is currently as a publisher." }, { status: 400 });
    }

    await prisma.publisher.update({
      where: {
        publisherName: user.publisher,
      },
      data: {
        staffs: {
          connect: {
            username: userExisting.username
          },
          update: {
            where: {
              username: userExisting.username,
            },
            data: {
              role: "PUBLISHER",
            }
          },
        }
      }
    });

    return NextResponse.json({ message: "Invite successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/manage-staff POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}