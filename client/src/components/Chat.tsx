"use client";

import { Button, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
	const [socket, setSocket] = useState<any>();
	const [message, setMessage] = useState<string>("");
	const [inbox, setInbox] = useState<string[]>([]);
	const [room, setRoom] = useState<string>("100");

	useEffect(() => {
		const socket = io("http://localhost:8080/",{auth:{
			token:"mark"
		}});
		setSocket(socket);

		const sendMsg = (message: string) => {
			setInbox((prevInbox) => [...prevInbox, message]);
		};

		const getMsg = (msg: string) => {
			console.log(msg);
		};

		socket.on("message", sendMsg);
		socket.on("receive-message", getMsg);

		return () => {
			socket.off("message", sendMsg);
			socket.off("receive-message", getMsg);
		};
	}, []);

	const sendMessage = () => {
		socket.emit("message", { room, message });
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
			<form
				onSubmit={(e) => {
					e.preventDefault();
					socket.emit("join-room", room);
				}}
			>
				<div className="flex gap-3">
					<div id="at-room"></div>
					<TextInput
						placeholder="room"
						value={room}
						onChange={(e) => {
							setRoom(e.target.value);
						}}
					/>
					<Button type="submit">join room</Button>
				</div>
			</form>
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
