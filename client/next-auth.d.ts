import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      displayName: string
      role: Role
      publisher?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
    displayName: string
    avatar: string | null
    role: Role
    publisher?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    username: string
    displayName: string
    avatar: string | null
    role: Role
    publisher?: string
  }
}