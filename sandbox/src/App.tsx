import { useContext, useEffect, useState } from "react";
import { Connection } from "./Socket";

export default function App() {
	const socket = useContext(Connection);
	useEffect(() => {
		if (socket) {
			const onConnect = () => {
				console.log("connect", socket.id);
			};
			const receive = (msg: string) => {
				console.log(msg);
			};
			socket.on("connect", onConnect);
			socket.on("receive-message", receive);
			return () => {
				socket.off("receive-message", receive);
				socket.off("connect", onConnect);
			};
		}
	}, [socket]);

	const [src, setSrc] = useState<string>("");
	const [dst, setDst] = useState<string>("");
	const [text, setText] = useState<string>("");
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<input
				type="text"
				placeholder="src username"
				value={src}
				onChange={(e) => setSrc(e.target.value)}
			/>
			<br />
			<input
				type="text"
				placeholder="dst username"
				value={dst}
				onChange={(e) => setDst(e.target.value)}
			/>

			<br />
			<input
				type="text"
				placeholder="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<br />
			<button type="submit">send</button>
		</form>
	);
}
