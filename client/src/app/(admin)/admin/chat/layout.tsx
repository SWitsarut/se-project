import prisma from "@/libs/prisma";
import Link from "next/link";
import SelectUser from "./SelectUser";
import { Suspense } from "react";

export default async function AdminChatLayout({ children }: { children: React.ReactNode }) {
  const users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN"
      },
    },
    include: {
      _count: { select: {
        sender: true
      } }
    }
  });

  const filteredUsers = users.filter((user) => user._count.sender > 0);
  
  return (
    <div className="w-full">
      <div className="prose">
        <h1>Chat</h1>
      </div>

      <div className="flex max-h-[70vh] min-h-[70vh] w-full">
        <div className="flex flex-col gap-2 border min-w-80">
          {filteredUsers.map((user) => (
            <SelectUser key={user.id} displayName={user.displayName} userId={user.id} />
          ))}
        </div>
        {children}
        
      </div>
    </div>
  )
}
