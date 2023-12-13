"use client"

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

export default function Home() {
	return (
		<>
			<Button onClick={() => signOut()}>Log out</Button>
		</>
	);
}