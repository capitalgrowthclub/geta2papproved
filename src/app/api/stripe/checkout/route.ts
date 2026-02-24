import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getPriceId, isSubscription, type PlanKey } from "@/lib/pricing";

const VALID_PLANS: PlanKey[] = ["single_credit", "monthly_pro", "annual_unlimited"];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, quantity: rawQty } = await req.json();
    const quantity = plan === "single_credit" ? Math.max(1, Math.min(10, Number(rawQty) || 1)) : 1;
    if (!plan || !VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const db = createServiceClient();

    // Ensure user record exists
    await db.from("users").upsert(
      {
        id: user.id,
        email: user.email || "",
        plan_type: "none",
        is_paid: false,
        credits_remaining: 0,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );

    const { data: existingUser } = await db
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = existingUser?.stripe_customer_id;

    // Verify the stored customer ID is valid in the current Stripe mode
    if (customerId) {
      try {
        await getStripe().customers.retrieve(customerId);
      } catch {
        console.log("Stored customer ID invalid, creating new customer:", customerId);
        customerId = null;
      }
    }

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await db
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const priceId = getPriceId(plan as PlanKey);
    const mode = isSubscription(plan as PlanKey) ? "subscription" : "payment";

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      customer_update: { name: "auto" },
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity }],
      mode,
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=cancelled`,
      metadata: { supabase_user_id: user.id, plan, quantity: String(quantity) },
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
