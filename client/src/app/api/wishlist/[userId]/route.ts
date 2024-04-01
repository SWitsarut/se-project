import { getCurrentSession } from "@/libs/getCurrentSession";
import { BookItemType } from "@/types/book";
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { revalidatePath } from "next/cache";

export const GET = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Not found user" }, { status: 400 });
    }

    const result = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            authors: true,
            category: true,
            publisher: true,
            comment: true
          }
        }
      }
    })

    const wishlists: BookItemType[] = result.map((wishlist) => ({
      isbn: wishlist.book.isbn,
      title: wishlist.book.title,
      cover: wishlist.book.cover,
      price: wishlist.book.price,
      authors: wishlist.book.authors.map((author) => author.authorName),
      category: wishlist.book.category.categoryName,
      publisher: wishlist.book.publisher.publisherName,
      rating: wishlist.book.comment.length > 0 ? wishlist.book.comment.reduce((acc, cur) => acc + cur.rating, 0) / wishlist.book.comment.length : 0,
      ratingCount: wishlist.book.comment.length,
    }));

    return NextResponse.json(wishlists, { status: 200 });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
  const session = await getCurrentSession();
  
  if(!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" } ,{ status: 403 });
  }

  const { isbn } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const existingInWishlit = await prisma.wishlist.findFirst({
      where: {
        userId,
        bookIsbn: isbn,
      }
    })

    const existingInLibrary  = await prisma.bookOwnership.findUnique({
      where: {
        userId_bookIsbn: {
          userId,
          bookIsbn: isbn
        }
      }
    });

    if(existingInLibrary) {
      return NextResponse.json({ error: "This book is already in your library" }, { status: 400 });
    }

    if (existingInWishlit) {
      await prisma.wishlist.delete({
        where: {
          userId_bookIsbn: {
            userId,
            bookIsbn: isbn
          }
        }
      })
      revalidatePath("/my-wishlists");
      return NextResponse.json({ message: "Remove from wishlist successful" }, { status: 200 });
    }

    await prisma.wishlist.create({
      data: {
        userId,
        bookIsbn: isbn
      }
    });

    revalidatePath("/my-wishlists");

    return NextResponse.json({ message: "Add to wishlist successful" }, { status: 200 });
  } catch (error) {
    console.log("Error at /api/wishlist/[userId] POST", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}