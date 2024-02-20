import { User } from "@/types/user";

async function getManagerList(slug: string): Promise<{ managers: User[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/get-manager-by-publisher/${slug}`, {
    cache: "no-store"
  })

  const data = await res.json();
  if(data.error) {
    throw new Error(data.error);
  }

  return data;
}

interface ManagerListProps {
  slug: string
}

export default async function ManagerList({ slug }: ManagerListProps) {
  const { managers } = await getManagerList(slug);
  console.log(managers)
  return (
    <div>ManagerList</div>
  )
}
