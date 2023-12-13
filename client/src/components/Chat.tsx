"use client";

import { socket } from "@/libs/scoket";
import { Button, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatProps {
	serverId: string
	roomId: string
}

export default function Chat({ serverId, roomId }: ChatProps) {
	const [message, setMessage] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		socket.emit("join-room", { serverId, roomId });
		socket.on("message", sendMessage);
		socket.on("receive-message", receiveMessage);

		return () => {
			socket.off("message", sendMessage);
			socket.off("receive-message", receiveMessage);
		};
	}, []);

	const receiveMessage = () => {
		router.refresh();
	}

	const sendMessage = async () => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/send-message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({message, serverId, roomId})
			})
			
			if(res.ok) {
				socket.emit("message", { serverId, roomId, message });
			}
		} catch (error) {
			console.log(error)
		} finally {
			setMessage("");
		}
	};

	return (
		<div className="mx-auto container my-16 flex flex-col gap-4">
			<div className="flex gap-6">
				<TextInput
					placeholder="typing message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button onClick={sendMessage}>Send</Button>
			</div>
		</div>
	);
}
