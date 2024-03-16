import prisma from '@/libs/prisma'
import Link from 'next/link';
import React from 'react'

export default async function page() {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    include: {
      _count: { select: {
        sender: true
      } }
    }
  });

  const filteredUsers = users.filter((user) => user._count.sender > 0);

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            <Link href={`/admin/chat/${user.id}`}>{user.displayName}</Link>
          </li>
        ))}
      </ul>
    </div>    
  )
}
