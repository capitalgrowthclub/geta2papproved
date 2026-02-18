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
    const customerEmail = session.customer_details?.email || "";
    const customerName = session.customer_details?.name || "";
    const [firstName, ...lastParts] = customerName.split(" ");
    const lastName = lastParts.join(" ");

    console.log("Webhook checkout.session.completed:", { clerkId, plan, customerEmail, customerName });

    if (clerkId && plan) {
      // Ensure user record exists before updating plan data
      const { error: upsertError } = await supabase.from("users").upsert(
        {
          clerk_id: clerkId,
          email: customerEmail,
          first_name: firstName || "",
          last_name: lastName || "",
          stripe_customer_id: session.customer as string,
          is_paid: false,
        },
        { onConflict: "clerk_id", ignoreDuplicates: true }
      );
      console.log("Webhook upsert result:", { upsertError });

      if (plan === "single_credit") {
        // One-time payment: add credits (supports multi-quantity)
        const quantity = parseInt(session.metadata?.quantity || "1", 10) || 1;

        // Get current user to check existing plan and credits
        const { data: currentUser, error: selectError } = await supabase
          .from("users")
          .select("plan_type, credits_remaining, stripe_subscription_id")
          .eq("clerk_id", clerkId)
          .single();

        console.log("Webhook single_credit - user lookup:", { currentUser, selectError });
        const currentCredits = currentUser?.credits_remaining || 0;
        const hasSubscription = !!currentUser?.stripe_subscription_id;

        // Only set plan_type to single_credit if user doesn't have an active subscription
        const updateData: Record<string, unknown> = {
          is_paid: true,
          credits_remaining: currentCredits + quantity,
        };
        if (!hasSubscription) {
          updateData.plan_type = "single_credit";
          updateData.plan_started_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from("users")
          .update(updateData)
          .eq("clerk_id", clerkId);

        if (updateError) {
          console.error("Error updating single credit:", updateError);
        }
      } else {
        // Subscription: set plan type and period
        const now = new Date();
        const expiresAt = new Date(now);
        if (plan === "monthly_pro") {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        // Preserve any existing single credits when upgrading to a subscription
        const { data: existingUser, error: selectError2 } = await supabase
          .from("users")
          .select("credits_remaining")
          .eq("clerk_id", clerkId)
          .single();

        console.log("Webhook subscription - user lookup:", { existingUser, selectError2 });
        const carryOverCredits = existingUser?.credits_remaining || 0;

        const { error: updateError } = await supabase
          .from("users")
          .update({
            is_paid: true,
            plan_type: plan,
            credits_remaining: carryOverCredits,
            stripe_subscription_id: session.subscription as string,
            plan_started_at: now.toISOString(),
            plan_expires_at: expiresAt.toISOString(),
            projects_used_this_period: 0,
            period_reset_at: now.toISOString(),
          })
          .eq("clerk_id", clerkId);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
        }
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
