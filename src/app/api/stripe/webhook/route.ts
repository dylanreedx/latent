import { db } from "@/db/db";
import { payment } from "@/db/schema";
import { headers } from "next/headers";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});
export async function POST(request: Request) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;

  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.async_payment_failed":
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      break;
    case "checkout.session.async_payment_succeeded":
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;

      break;
    case "checkout.session.completed":
      const checkoutSessionCompleted: any = event.data.object;
      console.log("checkoutSessionCompleted", checkoutSessionCompleted);
      const response1 = await db
        .insert(payment)
        .values({
          userId: checkoutSessionCompleted?.customer_details.email,
          email: checkoutSessionCompleted?.customer_details.email,
          amount: checkoutSessionCompleted?.amount_total,
          type: "ONE_TIME_PAYMENT",
        })
        .returning();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response("RESPONSE EXECUTE", {
    status: 200,
  });
}
