"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SelectUserProps {
  userId: string
  displayName: string
}

export default function SelectUser({ userId, displayName }: SelectUserProps) {
  const pathname = usePathname();
  return (
    <Link
      href={`/admin/chat/${userId}`}
      className={`p-4 border cursor-pointer ${pathname === `/admin/chat/${userId}` && "bg-primary text-white"}`}
    >
      {displayName}
    </Link>
  )
}
