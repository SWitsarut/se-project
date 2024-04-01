import { UserMsg } from "@/types/chat";
import AdminChat from "./AdminChat";
import prisma from "@/libs/prisma";

export default async function page() {
  const users = await prisma.chatMessage.findMany({
    where: {
      senderData: {
        role: {
          not: "ADMIN",
        },
      },
    },
    orderBy: {
      timeStamp: "desc",
    },
    include: {
      senderData: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
        },
      },
    },
    distinct: ["sender"],
  });

  const modifiedUsers = users.map((user) => ({
    ...user,
    ...user.senderData,
    senderData: undefined,
    counter: 0,
  }));

  return (
    <>
      <AdminChat users={modifiedUsers} />
    </>
  );
}
