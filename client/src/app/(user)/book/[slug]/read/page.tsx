import PdfReader from "@/components/PdfReader";
import { getCurrentSession } from "@/libs/getCurrentSession";
import { redirect } from "next/navigation";

const getBookData = async (slug: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

const checkIsOwned = async (slug: string, userId?: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/book/${slug}/${userId}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if(!data) {
    redirect("/")
  }
}

export default async function ReadPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getCurrentSession();
  
  await checkIsOwned(slug, session?.user.id);

  const bookData = await getBookData(slug);

  return (
    <>
      <PdfReader pdfUrl={bookData.pdfUrl} />
    </>
  )
}
