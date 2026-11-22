import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/cors/Session";
import { dashboardRole } from "@/lib/roles";
import { getPlanStatus } from "@/lib/actions/payment";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only vendors can buy Premium, and only for their own account.
  if (dashboardRole(user.role) !== "vendor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { premium, error } = await getPlanStatus(user.id);

  // Plan status jana na gele charge korbo na (double payment ekate).
  if (error) {
    return NextResponse.json(
      { error: "Could not verify your plan. Please try again in a moment." },
      { status: 503 },
    );
  }

  if (premium) {
    return NextResponse.json(
      { error: "You already have an active Premium plan." },
      { status: 409 },
    );
  }

  try {
    const headersList = await headers();
    const origin = headersList.get("origin") ?? new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID ?? "price_1UdyvwHVq79Iu3DRVKSnJJTZ",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { userId: user.id, userName: user.name },
      success_url: `${origin}/dashboard/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/vendor/subscription/cancel`,
      integration_identifier: "pizza_hub_web_001",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}