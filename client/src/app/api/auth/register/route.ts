import prisma from "@/libs/prisma";
import { sendVerificationEmail } from "@/libs/mail";
import { generateVerificationToken } from "@/libs/tokens";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { username, email, displayName, password, confirmPassword } = await req.json();

  if(!username || !email || !password || !displayName || !confirmPassword) {
    return NextResponse.json({ error: "Please fill your information completely" }, { status: 400 });
  }

  if(password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 character" }, { status: 400 });
  }

  if(password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords are not the same" }, { status: 400 });
  }

  try {
    const userExisting = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });
  
    if(userExisting) {
      return NextResponse.json({ error: "Username or Email already in use" }, { status: 400 });
    }
  
    const salt = 5;
    const hashedPassword = await hash(password, salt);

    await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        displayName,
        password: hashedPassword,
      }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    
    return NextResponse.json({ message: "Register successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/auth/register", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}