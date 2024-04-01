import PdfReader from "@/components/PdfReader";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

const getBookData = async (slug: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

const checkIsOwned = async (slug: string, userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}/${userId}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function ReadPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getCurrentSession();

  if(!session) redirect("/");
  const isOwned = await checkIsOwned(slug, session.user.id);
  
  if(!isOwned) redirect("/");
  const bookData = await getBookData(slug);

  return (
    <>
      <PdfReader pdfUrl={bookData.pdfUrl} />
    </>
  )
}
