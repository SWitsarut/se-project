import prisma from "@/libs/prisma";
import { getVerificationTokenByToken } from "@/libs/verification-token";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  const token = new URL(req.url).searchParams.get("token");

  if(!token || token == null) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const existingToken = await getVerificationTokenByToken(token);

  if(!existingToken) {
    return NextResponse.json({ error: "Token does not exist" },{ status: 400 })
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if(hasExpired) {
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: existingToken.email
    }
  })

  if(!existingUser) {
    return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  })

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id
    }
  })

  return NextResponse.json({ message: "Email verified" }, { status: 200 });
};
