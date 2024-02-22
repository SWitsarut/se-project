import { User } from "@/types/user";
import { Avatar, Button, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

async function getUser(): Promise<{ users: User[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-user`, {
    cache: "no-store"
  })
  const data = await res.json();

  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

export default async function UserList() {
  const { users } = await getUser();
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
            <TableTh>Active</TableTh>
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
              <TableTd>{user.isActive ? <Text c="green">Active</Text> : <Text c="red">Inactive</Text>}</TableTd>
              <TableTd>{user.role}</TableTd>
              <TableTd classNames={{ td: "gap-2 flex"}}>
                <Button leftSection={<IconPencil />} color="blue">Edit</Button>
                <Button leftSection={<IconTrash />} color="red">Delete</Button>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
