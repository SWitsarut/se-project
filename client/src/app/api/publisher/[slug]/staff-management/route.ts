import prisma from "@/libs/prisma";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { User } from "@/types/user";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { slug }}: { params: { slug: string }}) => {
  try {
    const result = await prisma.user.findMany({
      where: {
        publisher: {
          publisherName: slug,
        },
      },
      include: {
        publisher: true
      },
    })
  
    const staffs:User[] = result.map((staff) => ({
      id: staff.id,
      username: staff.username,
      email: staff.email,
      displayName: staff.displayName,
      role: staff.role,
      avatar: staff.avatar,
      publisherName: staff.publisher?.publisherName,
      isActive: staff.isActive
    }))
    
    return NextResponse.json({ staffs }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/publisher/[slug]/manage-staff GET");
    return NextResponse.json({ error: "Internal Server Error"})
  }
}

export const POST = async (req: Request, { params: { slug }}: { params: { slug: string }}) => {
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
        managerId: session.user.id,
        publisherName: session.user.publisher,
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
        publisherName: session.user.publisher,
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
    console.log("Error at /api/publisher/[slug]/staff-management POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}