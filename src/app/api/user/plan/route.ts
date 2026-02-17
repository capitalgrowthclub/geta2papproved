import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { PLANS, type PlanKey } from "@/lib/pricing";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    const { data: user } = await supabase
      .from("users")
      .select("plan_type, credits_remaining, projects_used_this_period, plan_expires_at, stripe_subscription_id, period_reset_at")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({
        plan_type: "none",
        credits_remaining: 0,
        projects_used_this_period: 0,
        project_limit: 0,
        plan_label: "No Plan",
        has_subscription: false,
      });
    }

    const planType = user.plan_type || "none";
    const planConfig = planType !== "none" ? PLANS[planType as PlanKey] : null;

    return NextResponse.json({
      plan_type: planType,
      credits_remaining: user.credits_remaining || 0,
      projects_used_this_period: user.projects_used_this_period || 0,
      project_limit: planConfig?.projectLimit || 0,
      plan_label: planConfig?.label || "No Plan",
      plan_period: planConfig?.period || null,
      plan_expires_at: user.plan_expires_at,
      has_subscription: !!user.stripe_subscription_id,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
