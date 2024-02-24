import { Suspense } from "react";
import UserList from "./UserList";
import SelectTake from "../_components/SelectTake";
import SearchBar from "../_components/SearchBar";
import CustomPagination from "../_components/CustomPagination";
import { Metadata } from "next";
import { Skeleton } from "@mantine/core";
import prisma from "@/libs/prisma";

export const metadata: Metadata = {
  title: "User management | E-book store"
}

interface UserManagementPageProps {
  searchParams?: {
    take?: string
    page?: string
    search?: string
  }
}

async function getTotalPage(take: number, search: string) {
  try {
    const count = await prisma.user.count({
      where: {
        username: {
          contains: search
        }
      }
    })

    return Math.ceil(count / take);
  } catch (error) {
    console.log(error);
    return 1;
  }
}

export default async function UserManagementPage({ searchParams }: UserManagementPageProps) {
  const take = Number(searchParams?.take) || 20;
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const totalPage = await getTotalPage(take, search);
  
  return (
    <>
      <div className="prose">
        <h1>User Management</h1>
      </div>

      <div className="flex gap-4">
        <SelectTake />
        <SearchBar label="Search for user"/>
      </div>

      <Suspense key={page + take + search} fallback={<Skeleton animate={true} height={400} />}>
        <UserList page={page} take={take} search={search}/>
      </Suspense>

      <CustomPagination totalPage={totalPage}/>
    </>
  );
}
