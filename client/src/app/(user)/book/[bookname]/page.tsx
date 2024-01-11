import Image from "next/image";

export default function BookPage({
  params: { bookname },
}: {
  params: { bookname: string };
}) {
  return (
    <>
      <div className="w-full border text-center">
        <h1>{bookname}</h1>
      </div>

      <div>
        <Image
          src={`https://cdn-local.mebmarket.com/meb/server1/265529/Thumbnail/book_detail_large.gif?2`}
          alt={"book_cover"}
          height={0}
          width={0}
          sizes="100vw"
          className="w-96 h-full aspect-[1/1.414]"
        />
      </div>
    </>
  );
}
