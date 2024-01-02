import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      displayName: string
      role: Role
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    displayName: string
    avatar: string | null
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    displayName: string
    avatar: string | null
    role: Role
  }
}