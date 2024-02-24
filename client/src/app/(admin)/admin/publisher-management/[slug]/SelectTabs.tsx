"use client";

import { Tabs, Text } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if(value) {
      params.set("tab", value);
    } else {
      params.delete("tab");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs value={searchParams.get("tab")?.toString()} onChange={(value) => handleSelect(value as string)} defaultValue={searchParams.get("tab")?.toString() || "book"}>
      <Tabs.List grow>
        <Tabs.Tab value="book" fw="bolder"><Text size="xl" fw="bolder">Book</Text></Tabs.Tab>
        <Tabs.Tab value="manager" fw="bolder"><Text size="xl" fw="bolder">Manager</Text></Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
