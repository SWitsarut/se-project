import { User } from "@/types/user";
import { Avatar, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";

async function getManagerList(slug: string): Promise<{ managers: User[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-manager-by-publisher/${slug}`, {
    cache: "no-store"
  })

  const data = await res.json();
  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

interface ManagerListProps {
  slug: string
}

export default async function ManagerList({ slug }: ManagerListProps) {
  const { managers } = await getManagerList(slug);

  return (
    <>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <TableThead>
          <TableTr>
            <TableTh w="44px">Avatar</TableTh>
            <TableTh>Username</TableTh>
            <TableTh>Email</TableTh>
            <TableTh>Display name</TableTh>
            <TableTh>Active</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {managers.map((manager) => (
            <TableTr key={manager.id}>
              <TableTd>
                <Avatar src={manager.avatar} className="mx-auto" />
              </TableTd>
              <TableTd>{manager.username}</TableTd>
              <TableTd>{manager.email}</TableTd>
              <TableTd>{manager.displayName}</TableTd>
              <TableTd>{manager.isActive ? <Text c="green">Active</Text> : <Text c="red">Inactive</Text>}</TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
