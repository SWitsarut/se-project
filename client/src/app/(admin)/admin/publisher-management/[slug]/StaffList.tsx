import { User } from "@/types/user";
import { Avatar, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";

async function getStaffList(slug: string, page: number, take: number, search: string): Promise<{ staffs: User[] }> {
  const searchParams = `?page=${page}&take=${take}&search=${search}`;
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-staff-by-publisher/${slug}${searchParams}`, {
    cache: "no-store"
  })

  const data = await res.json();
  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

interface StaffListProps {
  slug: string
  page: number
  take: number
  search: string
}

export default async function StaffList({ slug, page, take, search }: StaffListProps) {
  const { staffs } = await getStaffList(slug, page, take, search);

  return (
    <>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <TableThead>
          <TableTr>
            <TableTh w="44px">Avatar</TableTh>
            <TableTh>Username</TableTh>
            <TableTh>Email</TableTh>
            <TableTh>Display name</TableTh>
            <TableTh>Status</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {staffs.map((staff) => (
            <TableTr key={staff.id}>
              <TableTd>
                <Avatar src={staff.avatar} className="mx-auto" />
              </TableTd>
              <TableTd>{staff.username}</TableTd>
              <TableTd>{staff.email}</TableTd>
              <TableTd>{staff.displayName}</TableTd>
              <TableTd>{staff.isActive ? <Text c="green">Active</Text> : <Text c="red">Inactive</Text>}</TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
