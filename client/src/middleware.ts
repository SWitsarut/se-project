import { NextResponse } from "next/server";
import prisma from "./libs/prisma";

export async function middleware(request: Request) {
  if (
    request.url.startsWith(`${process.env.NEXT_PUBLIC_URL}/api`) &&
    !request.url.includes("edgestore") &&
    request.headers.get("user-agent") != "node"
  ) {
    // console.log("API Request URL: ", request.url);
    // console.log("API Request IP: ", request.headers.get("x-real-ip"));
    // console.log("API Request Method: ", request.method);
    // console.log("API Request user-agent: ", request.headers.get("user-agent"));
    // console.log("API Request header: ", request.headers);
    // console.log("body", request.body, "\n\n\n");
    // await prisma.log.create({
    //   data: {
    //     method: request.method,
    //     url: request.url,
    //     agent: JSON.stringify(request.headers.get("user-agent")),
    //     body: JSON.stringify(request.body),
    //   },
    // });
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/newlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: request.url,
        method: request.method,
        agent: request.headers.get("user-agent"),
        body: request.body,
      }),
    });
  }

  return NextResponse.next();
}
