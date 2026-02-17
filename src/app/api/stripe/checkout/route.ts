import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { getPriceId, isSubscription, type PlanKey } from "@/lib/pricing";

const VALID_PLANS: PlanKey[] = ["single_credit", "monthly_pro", "annual_unlimited"];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || !VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const supabase = createServiceClient();

    // Get or create user record
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    // Create or retrieve Stripe customer
    let customerId = existingUser?.stripe_customer_id;
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: email || undefined,
        metadata: { clerk_id: userId },
      });
      customerId = customer.id;

      await supabase.from("users").upsert({
        clerk_id: userId,
        email: email || "",
        stripe_customer_id: customerId,
        is_paid: false,
      }, { onConflict: "clerk_id" });
    }

    const priceId = getPriceId(plan as PlanKey);
    const mode = isSubscription(plan as PlanKey) ? "subscription" : "payment";

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=cancelled`,
      metadata: { clerk_id: userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
