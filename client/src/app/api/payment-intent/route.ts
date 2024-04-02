import { getCurrentSession } from "@/libs/getCurrentSession";
import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export const GET = async (req: Request) => {
  const session = await getCurrentSession();

  if(!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paymentIntentId = new URL(req.url).searchParams.get("payment-intent-id");

  if(!paymentIntentId) {
    return NextResponse.json({ error: "Payment intent id is required" }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return NextResponse.json({ paymentIntent });
  } catch (error) {
    if(error instanceof stripe.errors.StripeInvalidRequestError) {
      if(error.statusCode == 404) {
        return NextResponse.json({ error: "Not found payment intent" }, { status: 404 })
      } else {
        return NextResponse.json({ error: "Invalid Request Error" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Internal Server Error "}, { status: 500 });
    }
  }
  
}

export const POST = async (req: Request) => {
  const session = await getCurrentSession();

  if(!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { payment_intent_id, cartItems } = await req.json();

  const totalPrice = cartItems.reduce((acc: number, data: any) => acc + data.price, 0);

  if(payment_intent_id) {
    const curr = await stripe.paymentIntents.retrieve(payment_intent_id);
    if(curr) {
      const update_intent = await stripe.paymentIntents.update(payment_intent_id, { amount: totalPrice * 100 });
      try {
        await prisma.userOrder.update({
          where: {
            paymentIntentId: payment_intent_id
          },
          data: {
            order: {
              deleteMany: {},
              createMany: {
                data: cartItems.map((item: any) => ({
                  bookIsbn: item.isbn,
                  bookTitle: item.title,
                  userId: session.user.id,
                  bookPrice: item.price,
                })),
              }
            }
          }
        });
      } catch (error) {
        console.log("Error at /api/payment-intent POST", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
      }

      return NextResponse.json({ id: update_intent.id }, { status: 200});
    } else {
      return NextResponse.json({ error: "Not found payment intent" }, { status: 400 });
    }
  } else {
    const userOrder = await prisma.userOrder.findFirst({
      where: {
        status: "PENDING",
        order: {
          some: {
            userId: session.user.id
          },
        },
      },
    });

    if(userOrder) {
      const update_intent = await stripe.paymentIntents.update(userOrder.paymentIntentId, { amount: totalPrice * 100 });
      try {
        await prisma.userOrder.update({
          where: {
            paymentIntentId: userOrder.paymentIntentId
          },
          data: {
            order: {
              deleteMany: {},
              createMany: {
                data: cartItems.map((item: any) => ({
                  bookIsbn: item.isbn,
                  bookTitle: item.title,
                  userId: session.user.id,
                  bookPrice: item.price,
                })),
              }
            }
          }
        });
      } catch (error) {
        console.log("Error at /api/payment-intent POST", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
      }

      return NextResponse.json({ id: update_intent.id }, { status: 200});
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "thb",
      payment_method_types: ["card", "promptpay"],
    });

    await prisma.userOrder.create({
      data: {
        paymentIntentId: paymentIntent.id,
        order: {
          createMany: {
            data: cartItems.map((item: any) => ({
              bookIsbn: item.isbn,
              bookTitle: item.title,
              userId: session.user.id,
              bookPrice: item.price,
            })),
          }
        },
      }
    });
    
    return NextResponse.json({ id: paymentIntent.id }, { status: 200 });
  }
}