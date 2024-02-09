import { Button } from "@mantine/core";
import Link from "next/link";

export default function ManageBookPage() {
  return (
    <div>
      <Link href={"/publisher-admin/manage-books/add-book"}><Button>Add book</Button></Link>
    </div>
  )
}
