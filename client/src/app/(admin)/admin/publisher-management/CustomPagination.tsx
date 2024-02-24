"use client";

import { Pagination } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CustomPagination({
  page, totalPage
}: {
  page: number
  totalPage: number
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Pagination
      className="mx-auto"
      total={totalPage == 0 ? 1 : totalPage}
      value={page}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", `${e}`)
        router.replace(`${pathname}?${params.toString()}`)
      }}
    />
  );
}
