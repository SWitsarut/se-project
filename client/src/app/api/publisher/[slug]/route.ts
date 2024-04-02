import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { slug: string }}) => {
  try {
    const [ totalSellingBook, totalBook, bookSold, mostSoldBook ] = await Promise.all([
      prisma.book.count({
        where: {
          publisher: { publisherName: params.slug },
          AND: { isSelling: true },
        },
      }),
      prisma.book.count({
        where: { publisher: { publisherName: params.slug } },
      }),
      prisma.bookOwnership.count({
        where: { book: { publisher: { publisherName: params.slug } } },
      }),
      prisma.bookOwnership.groupBy({
        by: ["bookIsbn"],
        where: { book: { publisher: { publisherName: params.slug } } },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      totalSellingBook,
      totalBook,
      bookSold,
      mostSoldBook: mostSoldBook.map((data) => ({
        bookIsbn: data.bookIsbn,
        count: data._count,
      }))},
      { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/publisher/[slug] route: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}