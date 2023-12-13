import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name:"credentials",
      id: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string,
          password: string
        };

        if(!email || !password) throw new Error("");

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        })

        if(!user) throw new Error("Email or password is invalid");

        const isValidPassword = await compare(password, user.password);

        if(!isValidPassword) throw new Error("Email or password is invalid");

        return {
          id: user.id,
          email: user.email,
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        }
      }
    }
  }
}