import { Button } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose mx-auto text-center">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href={"/"}><Button>Return to home</Button></Link>
    </div>
  )
}