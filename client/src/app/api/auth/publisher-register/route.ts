import prisma from "@/libs/prisma";
import { sendVerificationEmail } from "@/libs/mail";
import { generateVerificationToken } from "@/libs/tokens";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { isValidString } from "@/utils";

export const POST = async (req: Request) => {
  const { username, email, displayName, password, confirmPassword, publisherName } = await req.json();

  if(!username || !email || !password || !displayName || !confirmPassword || !publisherName) {
    return NextResponse.json({ error: "Please fill your information completely" }, { status: 400 });
  }

  if(!isValidString(username) || !isValidString(displayName) || !isValidString(publisherName)) {
    return NextResponse.json({ error: "Username and Display Name and publisherName must not contain special characters" }, { status: 400 });
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
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });
  
    if(userExisting) {
      return NextResponse.json({ error: "Username or Email already in use" }, { status: 400 });
    }

    const publisherExisting = await prisma.publisher.findUnique({
      where: {
        publisherName: publisherName.trim(),
      }
    })

    if(publisherExisting) {
      return NextResponse.json({ error: "Already have a publisher" }, { status: 400 });
    }
  
    const salt = 5;
    const hashedPassword = await hash(password, salt);

    const result = await prisma.user.create({
      data: {
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        displayName: displayName.trim(),
        password: hashedPassword,
        role: "PUBLISHER",
        publisher: {
          create: {
            publisherName: publisherName.trim(),
          },
        },
      },
    });

    if(!result.publisherId){
      return NextResponse.json({ error: "Create publisher failed" }, { status: 500 });
    }

    await prisma.publisher.update({
      where: {
        id: result.publisherId
      },
      data: {
        manager: {
          connect: {
            id: result.id
          }
        },
        staffs: {
          connect: {
            id: result.id
          },
        },
      }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    
    return NextResponse.json({ message: "Register successful" }, { status: 201 });
  } catch (error) {
    console.log("Error at /api/auth/register", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
  
}