import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "./prisma";
import { PrismaClientKnownRequestError} from "@prisma/client/runtime/library.js";
import { compare } from "bcrypt";
import { generateVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./mail";

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string,
          password: string,
        }
        
        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              username: username.toLowerCase(),
            },
          });
        } catch(error) {
          console.log(error)
          if(error instanceof PrismaClientKnownRequestError) {
            throw new Error("Error Establishing a Database Connection");
          } else {
            throw new Error("Internal Server Error");
          }
        }
  
        if(!user) throw new Error("Login Failed: Your email or password is incorrect");

        if(!user.isActive) throw new Error("Login Failed: Your email or password is incorrect");

        const isValidPassword =  await compare(password, user.password);
        if(!isValidPassword) throw Error("Login Failed: Your email or password is incorrect");

        if(!user.emailVerified) {
          const verificationToken = await generateVerificationToken(user.email);

          await sendVerificationEmail(verificationToken.email, verificationToken.token);

          throw new Error("Confirmation email sent")
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.displayName = user.displayName;
        token.role = user.role;
        if(user.role === "PUBLISHER") {
          const publisher = await prisma.publisher.findFirst({
            where: {
              manager: {
                some: {
                  username: user.username
                }
              }
            }
          })
          
          if(publisher) {
            token.publisher = publisher.publisherName;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if(token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.displayName = token.displayName;
        session.user.image = token.avatar;
        session.user.role = token.role;
        session.user.publisher = token.publisher;
      }

      return session;
    }
  }
}