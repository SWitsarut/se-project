import prisma from "@/libs/prisma";
import { User } from "@/types/user";
import { Avatar, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import ActionStaffModal from "./ActionStaffModal";
import { getCurrentSession } from "@/libs/getCurrentSession";

interface StaffListProps {
  staffId: string
  publisherName: string
}

async function getStaffByPublisher(publisherName: string): Promise<{ staffs: User[] }>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/publisher/${publisherName}/staff-management`, {
    cache: "no-store",
  })

  const data = await res.json();
  
  if(data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

async function checkIsManager(staffId: string, publisherName: string) {
  try {
    const result = await prisma.publisher.findUnique({
      where: {
        managerId: staffId,
        publisherName,
      }
    })

    return result ? true : false;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to check is manager");
  }
}

export default async function StaffList({ staffId, publisherName } : StaffListProps) {
  const session = await getCurrentSession();

  const { staffs } = await getStaffByPublisher(publisherName);
  const isManager = await checkIsManager(staffId, publisherName);
  
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
            {isManager && (
              <TableTh>Actions</TableTh>
            )}
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
              {isManager && (
                <TableTd classNames={{ td: "gap-2 flex" }}>
                  <ActionStaffModal
                    managerId={staffId}
                    publisherName={publisherName}
                    staffId={staff.id}
                    staffUsername={staff.username}
                  />
                </TableTd>
              )}
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
