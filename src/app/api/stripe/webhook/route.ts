import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import Stripe from "stripe";
import type { PlanKey } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkId = session.metadata?.clerk_id;
    const plan = session.metadata?.plan as PlanKey | undefined;

    if (clerkId && plan) {
      if (plan === "single_credit") {
        // One-time payment: add credits (supports multi-quantity)
        const quantity = parseInt(session.metadata?.quantity || "1", 10) || 1;

        // Get current credits to add to them
        const { data: currentUser } = await supabase
          .from("users")
          .select("credits_remaining")
          .eq("clerk_id", clerkId)
          .single();

        const currentCredits = currentUser?.credits_remaining || 0;

        await supabase
          .from("users")
          .update({
            is_paid: true,
            plan_type: "single_credit",
            credits_remaining: currentCredits + quantity,
            plan_started_at: new Date().toISOString(),
          })
          .eq("clerk_id", clerkId);
      } else {
        // Subscription: set plan type and period
        const now = new Date();
        const expiresAt = new Date(now);
        if (plan === "monthly_pro") {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        await supabase
          .from("users")
          .update({
            is_paid: true,
            plan_type: plan,
            credits_remaining: 0,
            stripe_subscription_id: session.subscription as string,
            plan_started_at: now.toISOString(),
            plan_expires_at: expiresAt.toISOString(),
            projects_used_this_period: 0,
            period_reset_at: now.toISOString(),
          })
          .eq("clerk_id", clerkId);
      }
    } else if (clerkId) {
      // Legacy fallback: no plan metadata
      await supabase
        .from("users")
        .update({ is_paid: true })
        .eq("clerk_id", clerkId);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined;

    if (subscriptionId) {
      // Reset period usage on renewal
      const now = new Date();
      const { data: user } = await supabase
        .from("users")
        .select("plan_type")
        .eq("stripe_subscription_id", subscriptionId)
        .single();

      if (user) {
        const expiresAt = new Date(now);
        if (user.plan_type === "monthly_pro") {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        await supabase
          .from("users")
          .update({
            projects_used_this_period: 0,
            period_reset_at: now.toISOString(),
            plan_expires_at: expiresAt.toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("users")
      .update({
        plan_type: "none",
        stripe_subscription_id: null,
        plan_expires_at: null,
        projects_used_this_period: 0,
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
