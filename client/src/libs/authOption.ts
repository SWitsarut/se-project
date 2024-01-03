import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string,
          password: string,
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
  
          if(!user) throw Error("Login Failed");
  
          const isValidPassword =  await compare(password, user.password);
          if(!isValidPassword) throw Error("Login Failed");
  
          return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar,
            role: user.role,
          }  
        } catch (error: any) {
          if(error instanceof PrismaClientInitializationError) {
            throw new Error("Database server is down.")
          }
          throw Error("Login Failed: Your email or password is incorrect.")
        }
        
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        token.id = user.id;
        token.email = user.email;
        token.displayName = user.displayName;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if(token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.displayName = token.displayName;
        session.user.image = token.avatar;
        session.user.role = token.role;
      }

      return session;
    }
  }
}