"use client"

import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectTake() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      label="Amount displayed"
      data={["5", "10", "15", "20", "25", "30"]}
      allowDeselect={false}
      defaultValue={searchParams.get("take")?.toString() || "20"}
      onChange={(value) => {
        const params = new URLSearchParams(searchParams);
        params.set("take", `${value}`)
        router.replace(`${pathname}?${params.toString()}`)
      }}
    />
  )
}
