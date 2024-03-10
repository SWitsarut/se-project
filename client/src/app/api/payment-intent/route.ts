import { getCurrentSession } from "@/libs/getCurrentSession";
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
      return NextResponse.json({ paymentIntent: update_intent });
    } else {
      return NextResponse.json({ error: "Not found payment intent" }, { status: 400 });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "thb",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ paymentIntent }, { status: 200 });
  }
}