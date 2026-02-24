import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { PLANS, type PlanKey } from "@/lib/pricing";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServiceClient();

    const { data: userData } = await db
      .from("users")
      .select("plan_type, credits_remaining, projects_used_this_period, plan_expires_at, stripe_subscription_id, period_reset_at")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return NextResponse.json({
        plan_type: "none",
        credits_remaining: 0,
        projects_used_this_period: 0,
        project_limit: 0,
        plan_label: "No Plan",
        has_subscription: false,
      });
    }

    const planType = userData.plan_type || "none";
    const planConfig = planType !== "none" ? PLANS[planType as PlanKey] : null;

    return NextResponse.json({
      plan_type: planType,
      credits_remaining: userData.credits_remaining || 0,
      projects_used_this_period: userData.projects_used_this_period || 0,
      project_limit: planConfig?.projectLimit || 0,
      plan_label: planConfig?.label || "No Plan",
      plan_period: planConfig?.period || null,
      plan_expires_at: userData.plan_expires_at,
      has_subscription: !!userData.stripe_subscription_id,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
