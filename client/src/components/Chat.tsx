"use client";

import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";

interface ChatProps {
	serverId: string
	roomId: string
}

export default function Chat({ serverId, roomId }: ChatProps) {
	const [message, setMessage] = useState<string>("");
	const { sendMessage, socket } = useSocket();

	const send = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({message, serverId, roomId})
			})
			
			if(res.ok) {
				sendMessage(serverId, roomId, message);
			}
		} catch (error) {
			console.log(error)
		} finally {
			setMessage("");
		}
	};

	useEffect(() => {
		socket.emit("join-room", {serverId, roomId})
	}, [])

	return (
		<div className="mx-auto container my-16 flex flex-col gap-4">
			<div className="flex gap-6">
				<TextInput
					placeholder="typing message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button onClick={send}>Send</Button>
			</div>
		</div>
	);
}
