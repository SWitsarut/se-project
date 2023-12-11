"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface ChatProps {
	serverId: string
	roomId: string
}

export default function Chat({ serverId, roomId }: ChatProps) {
	const [socket, setSocket] = useState<any>();
	const [message, setMessage] = useState<string>("");
	const [inbox, setInbox] = useState<string[]>([]);

	useEffect(() => {
		const socket = io("http://localhost:8080/",{auth:{
			token:"mark",
		}});
		setSocket(socket);

		socket.emit("join-room", { serverId, roomId });
		socket.on("message", sendMessage);
		socket.on("receive-message", receiveMessage);

		return () => {
			socket.off("message", sendMessage);
			socket.off("receive-message", receiveMessage);
		};
	}, []);

	const receiveMessage = (msg: string) => {
		console.log(msg)
		setInbox((prevInbox) => [...prevInbox, msg]);
	}

	const sendMessage = () => {
		socket.emit("message", { serverId, roomId, message });
		setMessage("");
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
			
			<div>
				{inbox.map((msg, index) => (
					<div key={index} className="border rounded-md">
						<Text>{msg}</Text>
					</div>
				))}
			</div>
		</div>
	);
}
