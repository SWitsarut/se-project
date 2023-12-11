import Chat from "@/components/Chat";

export default function RoomPage({ params }: { params: { serverId: string, roomId: string } }) {
  return (
    <Chat serverId={params.serverId} roomId={params.roomId}/>
  )
}
