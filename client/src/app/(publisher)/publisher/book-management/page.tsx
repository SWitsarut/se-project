import { Button } from "@mantine/core";
import Link from "next/link";

export default function ManageBookPage() {
  return (
    <div>
      <Link href={"/publisher/book-management/add-book"}><Button>Add book</Button></Link>
    </div>
  )
}
