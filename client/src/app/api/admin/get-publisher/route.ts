import prisma from "@/libs/prisma";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));
  const search = new URL(req.url).searchParams.get("search");
  const action = new URL(req.url).searchParams.get("action");

  try {
    if(action == "get-page") {
      const count = await prisma.publisher.count({
        where: {
          publisherName: {
            contains: search || "",
            mode: "insensitive",
          }
        }
      })
  
      const totalPage = Math.ceil(count / take);
  
      return NextResponse.json({ totalPage }, { status: 200 });
    }

    const publishers = await prisma.publisher.findMany({
      skip: take * (page - 1),
      take: take,
      include: {
        book: true,
      },
      where: {
        publisherName: {
          contains: search || "",
          mode: "insensitive"
        }
      }
    });

    const count = await prisma.publisher.count({
      where: {
        publisherName: {
          contains: search || "",
          mode: "insensitive",
        }
      }
    })

    const totalPage = Math.ceil(count / take);

    return NextResponse.json({ publishers, totalPage }, { status: 200 });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError && error.code == "P1001") {
      return NextResponse.json(
        { error: "Can't reach database server" },
        { status: 500 },
      );
    }
    
    if (error instanceof PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Something goes wrong when the query engine is started and the connection to the database is created" },
        { status: 500 },
      );
    }

    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};
