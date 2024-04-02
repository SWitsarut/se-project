import { NextResponse } from "next/server";

export function POST(req: Request) {
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
