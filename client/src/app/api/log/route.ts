import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { url, method, agent } = await req.json();
    await prisma.log.create({
      data: {
        url: url,
        method: method,
        agent: agent,
      },
    });
    return NextResponse.json({ message: "Success" }, { status: 201 });
    
  } catch (error) {
    console.log("Error at log POST:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
