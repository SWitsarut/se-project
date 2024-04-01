import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: Request) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature");

    if(!signature){
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        try {
          await prisma.$transaction(async (prisma) => {
            const userOrder = await prisma.userOrder.update({
              where: {
                paymentIntentId: paymentIntent.id,
              },
              data: {
                status: "SUCCEEDED"
              },
              include: {
                order: true
              }
            });

            await prisma.cartItem.deleteMany({
              where: {
                userId: userOrder.order[0].userId,
                bookIsbn: {
                  in: userOrder.order.map((book) => book.bookIsbn)
                }
              }
            })

            await prisma.wishlist.deleteMany({
              where: {
                userId: userOrder.order[0].userId,
                bookIsbn: {
                  in: userOrder.order.map((book) => book.bookIsbn)
                }
              }
            });

            await Promise.all(userOrder.order.map(async (order) => {
              await prisma.bookOwnership.create({
                data: {
                  userId: userOrder.order[0].userId,
                  bookIsbn: order.bookIsbn
                }
              });
            }));
          });
        } catch (error) {
          await prisma.userOrder.update({
            where: {
                paymentIntentId: paymentIntent.id
            },
            data: {
              status: "FAILED"
            }
          });

          return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.log("Error at /api/webhook", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}