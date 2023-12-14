import RoomList from "@/components/RoomList";
import SideBar from "@/components/SideBar";
import SocketProvider from "@/components/SocketProvider";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ServerPageProps {
  children: React.ReactNode
  params: {
    serverId: string
  }
}

const getServerData = async (serverId: string, userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/server/${serverId}?userid=${userId}`, {
    cache: "no-store",
  });

  if(res.ok) {
    return res.json();
  }
}

export default async function ServerLayout({ children, params: { serverId } }: ServerPageProps) {
  const session = await getServerSession(authOptions);

  if(!session) {
    redirect("/")
  }

  const data: {
    room: {
        id: string;
        roomName: string;
        serverId: string;
    }[];
    users: {
        displayName: string;
        email: string;
    }[];
} & {
    id: string;
    serverName: string;
    serverImg: string | null;
    userIDs: string[];
} = await getServerData(serverId, session.user.id);

  if(!data) {
    redirect("/me");
  }

  return (
    <SocketProvider>
      <div className="flex">
        <SideBar data={data}/>
        <div className="flex flex-col gap-4 mr-4">
          {data.room.map((roomData, index) => (
            <RoomList key={index} roomId={roomData.id} roomName={roomData.roomName} serverId={roomData.serverId}/>
          ))}
        </div>
        <div>{children}</div>
      </div>
    </SocketProvider>
  )
}
