"use client";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

// export async function getClientSideProps() {
// 	const socket = io("http://localhost:8080");
// 	return {
// 		props: {
// 			socket,
// 		},
// 	};
// }

export default function Home() {
	// const socket = io("http://localhost:8080");
	// useEffect(() => {
	// 	socket.connect();
	// 	return ()=>{
	// 		socket.disconnect();
	// 	}
	// }, [socket]);
	return <div>Home</div>;
}
// export default function Home() {
// 	return <div>Home</div>;
// }
