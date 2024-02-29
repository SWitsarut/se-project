import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/session"
import { User } from "@/types/user";
import { Avatar, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import ActionStaffModal from "./ActionStaffModal";

async function getStaffByPublisher(publisherName: string) {
  const result = await prisma.user.findMany({
    where: {
      publisher: {
        publisherName,
      },
    },
    include: {
      publisher: true
    },
  })

  const staffs:User[] = result.map((staff) => ({
    id: staff.id,
    username: staff.username,
    email: staff.email,
    displayName: staff.displayName,
    role: staff.role,
    avatar: staff.avatar,
    publisherName: staff.publisher?.publisherName,
    isActive: staff.isActive
  }))

  return staffs;
}

async function checkIsManager(userId: string, publisherName: string) {
  try {
    const result = await prisma.publisher.findUnique({
      where: {
        managerId: userId,
        publisherName,
      }
    })

    return result ? true : false;
  } catch (error) {
    throw new Error("Failed to check is manager");
  }
}

export default async function StaffList() {
  const user = await getCurrentUser();

  if(!user || !user.publisher || user.role !== "PUBLISHER") {
    redirect("/");
  }

  const staffs = await getStaffByPublisher(user.publisher);
  const isManager = await checkIsManager(user.id, user.publisher);
  
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
            <TableTh>Actions</TableTh>
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
              <TableTd classNames={{ td: "gap-2 flex" }}>
                <ActionStaffModal staff={staff} isManager={isManager}/>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </>
  )
}
