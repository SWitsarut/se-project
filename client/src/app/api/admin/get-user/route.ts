import prisma from "@/libs/prisma";
import { User } from "@/types/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await prisma.user.findMany();

    const users: User[] = result.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive
    }))

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}