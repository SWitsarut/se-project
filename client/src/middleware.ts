import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  if (
    request.url.startsWith(`${process.env.NEXT_PUBLIC_URL}/api`) &&
    !request.url.includes("edgestore") &&
    request.headers.get("user-agent") != "node"
  ) {

    fetch(`${process.env.NEXT_PUBLIC_URL}/api/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: request.url,
        method: request.method,
        agent: request.headers.get("user-agent"),
      }),
    });
  }

  return NextResponse.next();
}
