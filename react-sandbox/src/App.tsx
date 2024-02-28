import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { Massage } from "./Type/Massage";

export default function App() {
	const socket = useRef<Socket | null>(null);
	const msg = useRef<HTMLInputElement | null>(null);
	const reciever = useRef<HTMLInputElement | null>(null);
	const curRoom = "1234";
	useEffect(() => {
		const joinedRoom = ["1234"];
		socket.current = io("localhost:8080");

		const onConnect = () => {
			socket.current?.emit("join", joinedRoom);
			console.log("connect", socket.current?.id);
		};

		const receive = (msg: string) => {
			console.log(msg);
		};

		socket.current.on("connect", onConnect);
		socket.current.on("receive-message", receive);

		return () => {
			socket.current?.off("receive-message", receive);
			socket.current?.off("connect", onConnect);
		};
	}, []);

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const sendingMsg: Massage = {
						massage: msg.current?.value ?? "",
						sender: socket.current?.id,
						receiver: curRoom,
					};
					socket.current?.emit("message", sendingMsg);
				}}
			>
				<label>to</label>
				<input type="text" ref={reciever} />
				<br />
				<input type="text" ref={msg} />
				<button type="submit">send</button>
			</form>
		</div>
	);
}
