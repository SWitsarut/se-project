import { User } from "@/types/user";
import { Avatar, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import ActionUserModal from "./ActionUserModal";
import prisma from "@/libs/prisma";
import { BASE_URL } from "@/utils";

async function getUser(page: number, take: number, search: string): Promise<{ users: User[] }> {
  const searchParams = new URLSearchParams({ page: page.toString(), take: take.toString(), search });
  const res = await fetch(`${BASE_URL}/api/admin/user-management?` + searchParams, {
    cache: "no-store"
  });
  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

async function getPublisherName() {
  const result = await prisma.publisher.findMany({
    select: {
      publisherName: true
    }
  })

  return result;
}

interface UserListProps {
  page: number
  take: number
  search: string
}

export default async function UserList({ page, take, search }: UserListProps) {
  const [{ users }, publishers] = await Promise.all([getUser(page, take, search), getPublisherName()])

  return (
    <>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <TableThead>
          <TableTr>
            <TableTh w="44px">Avatar</TableTh>
            <TableTh>Username</TableTh>
            <TableTh>Email</TableTh>
            <TableTh>Display name</TableTh>
            <TableTh>Role</TableTh>
            <TableTh>Publisher name</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>Actions</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {users.map((user) => (
            <TableTr key={user.id}>
              <TableTd>
                <Avatar src={user.avatar} className="mx-auto" />
              </TableTd>
              <TableTd>{user.username}</TableTd>
              <TableTd>{user.email}</TableTd>
              <TableTd>{user.displayName}</TableTd>
              <TableTd>{user.role}</TableTd>
              <TableTd>{user.publisherName ? user.publisherName : "-"}</TableTd>
              <TableTd>{user.isActive ? <Text c="green">Active</Text> : <Text c="red">Inactive</Text>}</TableTd>
              <TableTd classNames={{ td: "gap-2 flex"}}>
                <ActionUserModal
                  publisherName={publishers.map((publisher) => publisher.publisherName)}
                  user={user}
                />
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
