import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcrypt";
import { PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
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

        const { email, password } = credentials as {
          email: string,
          password: string,
        }
        
        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: email.toLocaleLowerCase()
            }
          });
        } catch(error) {
          console.log(error)
          if(error instanceof PrismaClientKnownRequestError) {
            throw new Error("Database is down");
          } else {
            throw new Error("Internal server")
          }
        }
  
        if(!user) throw new Error("Login Failed: Your email or password is incorrect.");

        if(!user.isActive) {
          throw new Error("Login Failed: Your email or password is incorrect")
        }

        const isValidPassword =  await compare(password, user.password);
        if(!isValidPassword) throw Error("Login Failed: Your email or password is incorrect.");

        if(!user.emailVerified) {
          const verificationToken = await generateVerificationToken(user.email);

          await sendVerificationEmail(verificationToken.email, verificationToken.token);

          throw new Error("Confirmation email sent")
        }

        return {
          id: user.id,
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