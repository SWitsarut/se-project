import { authOptions } from "@/libs/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import AddServer from "./AddServer";
import ServerCard from "./ServerCard";

const getMyServer = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/me/get-my-server/${userId}`, {
    cache: "no-store",
  });
  const data = await res.json();

  return data;
}

export default async function page() {
  const session = await getServerSession(authOptions);
  
  if(!session) {
    redirect("/");
  }

  const data = await getMyServer(session.user.id);

  return (
    <>
      <div>{session.user.id}</div>
      <div><AddServer session={session}/></div>
      {data && (
        data.servers.map((server: any, index: number) => (
          <ServerCard key={index} serverId={server.id} serverName={server.serverName} roomId={server.room[0].id}/>
        ))
      )}
    </>
  )
}
