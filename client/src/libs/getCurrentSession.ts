import { getServerSession } from "next-auth";
import { authOption } from "./authOption";

export async function getCurrentSession() {
  const session = await getServerSession(authOption);

  return session
}