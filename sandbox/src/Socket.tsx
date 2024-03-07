"use client";
import { createContext, useRef } from "react";
import { io, Socket as SocketType } from "socket.io-client";

const Connection = createContext<SocketType | undefined | null>(undefined);

export default function Socket({ children }: { children: React.ReactNode }) {
	const socket = useRef<SocketType | null>();

	socket.current = io("localhost:8080", { autoConnect: false });
	socket.current.auth = { username: "suea" };

	return (
		<>
			<Connection.Provider value={socket.current}>{children}</Connection.Provider>
		</>
	);
}
export { Connection };
