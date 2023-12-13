import Link from "next/link";

interface RoomListProps {
  roomId: string,
  roomName: string,
  serverId: string,
}

export default function RoomList({ roomId, roomName, serverId }: RoomListProps) {
  return (
    <Link className="bg-primary p-2 rounded-md w-32" href={`/room/${serverId}/${roomId}`}>{roomName}</Link>
  )
}
