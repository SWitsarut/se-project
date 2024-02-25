"use client";

import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  label?: string
}

export default function SearchBar({ label }: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchParams.get("search")?.toString());

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set("page", "1")
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form className="flex gap-1 items-end" onSubmit={(e) => handleSearch(e)}>
      <TextInput
        label={label}
        placeholder="search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button type="submit"><IconSearch /></Button>
    </form>
  )
}
