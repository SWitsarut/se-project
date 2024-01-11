import { sendVerificationEmail } from "@/libs/mail";
import prisma from "@/libs/prisma";
import { generateVerificationToken } from "@/libs/tokens";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, displayName, password } = await req.json();

  try {
    const userExisting = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      }
    })
  
    if(userExisting) {
      return NextResponse.json("Email already in use.", { status: 400 });
    }
  
    const salt = 10;
    const hashedPassword = await hash(password, salt);

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        displayName,
        password: hashedPassword,
      }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    
    return NextResponse.json("Register successful", { status: 201 })
    
  } catch (error) {
    console.log(error)
    return NextResponse.json("Internal Server", { status: 500 })
  }
  
}