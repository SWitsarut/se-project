"use client";

import { Button, Select, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchPublisherProps {
  search: string
  take: number
}

export default function SearchPublisher({ search, take }:SearchPublisherProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-8">
      <form className="flex items-end gap-2" onSubmit={(e) => handleSearch(e)}>
        <TextInput
          label="Search for publisher"
          placeholder="search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type="submit"><IconSearch /></Button>
      </form>

      <Select
        label="Amount displayed"
        data={["5", "10", "15", "20", "25", "30"]}
        value={String(take)}
        onChange={(value) => {
          const params = new URLSearchParams(searchParams);
          params.set("take", `${value}`)
          router.replace(`${pathname}?${params.toString()}`)
        }}
      />
    </div>
  )
}
