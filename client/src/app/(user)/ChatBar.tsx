"use client"

import { Connection } from '@/components/ChatProvider'
import React, { useContext, useEffect } from 'react'

export default function ChatBar() {
  const socket = useContext(Connection)

  useEffect(()=>{
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
  },[socket])
  return (
    <div className='fixed bottom-0 right-0 bg-black p-2 w-[25vw] text-white' >ho</div>
  );
}
