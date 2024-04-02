"use client";

import { Button, Menu, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.refresh();
    router.push(`/search?q=${search}`);
    setOpened(false)
    setSearch("");
  }

  return (
    <>
      <Menu opened={opened} onChange={setOpened} zIndex={1000} shadow="md" width={200}>
        <Menu.Target>
          <Button><IconSearch /></Button>
        </Menu.Target>

        <Menu.Dropdown>
          <form onSubmit={handleSearch}>
            <TextInput
              autoFocus
              autoComplete="off"
              leftSection={<IconSearch />}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button className="hidden" type="submit" />
          </form>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}
