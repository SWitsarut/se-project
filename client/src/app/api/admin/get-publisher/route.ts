import prisma from "@/libs/prisma";
import { PublisherResponse } from "@/types/publisher";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const take = Number(new URL(req.url).searchParams.get("take"));
  const page = Number(new URL(req.url).searchParams.get("page"));
  const search = new URL(req.url).searchParams.get("search");

  try {
    const result = await prisma.publisher.findMany({
      include: {
        book: true,
      },
      where: {
        publisherName: {
          contains: search || "",
          mode: "insensitive"
        }
      },
      take,
      skip: take * (page - 1),
    });

    const publishers: PublisherResponse[] = result.map((publisher) => ({
      id: publisher.id,
      publisherName: publisher.publisherName,
      totalBook: publisher.book.length
    }))

    return NextResponse.json({ publishers }, { status: 200 });
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
