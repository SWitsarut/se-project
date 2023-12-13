import Chat from "@/components/Chat";
import { Text } from "@mantine/core";

const getRoomData = async (serverId: string, roomId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/server/${serverId}/${roomId}`, {
    cache: "no-cache",
  })

  if(res.ok) {
    return res.json();
  }
}

export default async function RoomPage({ params }: { params: { serverId: string, roomId: string } }) {
  const dataMsg: {messages: {
    message: string | null;
    picture: string | null;
    user: {
        displayName: string;
        email: string;
    };
  }[]} = await getRoomData(params.serverId, params.roomId);

  return (
    <>
      <Chat serverId={params.serverId} roomId={params.roomId}/>

      <div className="flex flex-col gap-2">
        {dataMsg.messages.map((data, index) => (
          <div key={index} className="bg-slate-200 rounded-xl px-6 py-2">
            <Text>{data.message}</Text>
            <Text size="xs">by {data.user.displayName}</Text>
          </div>
        ))}
      </div>
    </>
  )
}
