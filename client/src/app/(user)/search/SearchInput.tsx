"use client";

import { Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchInputProps {
  searchBy: string
}

export default function SearchInput({ searchBy }: SearchInputProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("page", "1")
      params.set("q", search);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleClickSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("page", "1")
      params.set("q", search);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const setSearchBy = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("search-by", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 justify-center">
      <Tabs onChange={(e) => setSearchBy(e as string)} classNames={{ root: "w-full max-w-4xl mx-auto"}} variant="outline" defaultValue={searchBy}>
        <Tabs.List>
          <Tabs.Tab value={"book-title"}>Book title</Tabs.Tab>
          <Tabs.Tab value={"publisher"}>Publisher</Tabs.Tab>
          <Tabs.Tab value={"author"}>Author</Tabs.Tab>
          <Tabs.Tab value={"genre"}>Genre</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <div className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSearch}>
          <TextInput
            leftSection={<IconSearch type="submit" onClick={handleClickSearch} className="cursor-pointer" />}
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <Button classNames={{ root: "hidden" }} type="submit"><IconSearch /></Button> */}
        </form>
      </div>
    </div>
  )
}
