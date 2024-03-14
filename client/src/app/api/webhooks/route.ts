import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: Request) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature");

    console.log("rawBody", rawBody);
    console.log("signature", signature);

    if(!signature){
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    switch (event.type) {
      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        console.log("charge", charge);
        break;
      case "charge.failed":
        const failedCharge = event.data.object as Stripe.Charge;
        console.log("failedCharge", failedCharge);
        break;
      case "charge.updated":
        const updatedCharge = event.data.object as Stripe.Charge;
        console.log("updatedCharge", updatedCharge);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.log("Error at /api/webhook", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}