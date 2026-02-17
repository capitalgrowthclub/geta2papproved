import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanType = "none" | "single_credit" | "monthly_pro" | "annual_unlimited";

export const PLANS = {
  single_credit: {
    label: "Single Credit",
    price: 47,
    projectLimit: 1,
    period: "one-time" as const,
    description: "1 A2P Project",
  },
  monthly_pro: {
    label: "Monthly Pro",
    price: 97,
    projectLimit: 15,
    period: "month" as const,
    description: "Up to 15 projects/month",
  },
  annual_unlimited: {
    label: "Annual Unlimited",
    price: 497,
    projectLimit: 150,
    period: "year" as const,
    description: "Up to 150 projects/year",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPriceId(plan: PlanKey): string {
  const map: Record<PlanKey, string> = {
    single_credit: process.env.STRIPE_PRICE_ID_SINGLE!,
    monthly_pro: process.env.STRIPE_PRICE_ID_MONTHLY!,
    annual_unlimited: process.env.STRIPE_PRICE_ID_ANNUAL!,
  };
  return map[plan];
}

export function isSubscription(plan: PlanKey): boolean {
  return plan === "monthly_pro" || plan === "annual_unlimited";
}

interface UserPlanData {
  plan_type: PlanType;
  credits_remaining: number;
  projects_used_this_period: number;
  plan_expires_at: string | null;
}

export function canCreateProject(user: UserPlanData): { allowed: boolean; reason?: string } {
  if (user.plan_type === "none") {
    return { allowed: false, reason: "You need a plan to create projects. Choose a plan to get started." };
  }

  if (user.plan_type === "single_credit") {
    if (user.credits_remaining <= 0) {
      return { allowed: false, reason: "You've used your single credit. Purchase another credit or upgrade to a subscription." };
    }
    return { allowed: true };
  }

  // Subscription plans
  const plan = PLANS[user.plan_type as PlanKey];
  if (!plan) {
    return { allowed: false, reason: "Invalid plan type." };
  }

  // Check expiration
  if (user.plan_expires_at && new Date(user.plan_expires_at) < new Date()) {
    return { allowed: false, reason: "Your subscription has expired. Please renew to continue creating projects." };
  }

  if (user.projects_used_this_period >= plan.projectLimit) {
    return {
      allowed: false,
      reason: `You've reached your limit of ${plan.projectLimit} projects this ${plan.period}. Upgrade your plan or wait for the next billing period.`,
    };
  }

  return { allowed: true };
}

export async function consumeCredit(supabase: SupabaseClient, userId: string): Promise<void> {
  // Get current user data
  const { data: user } = await supabase
    .from("users")
    .select("plan_type, credits_remaining, projects_used_this_period")
    .eq("id", userId)
    .single();

  if (!user) return;

  if (user.plan_type === "single_credit") {
    await supabase
      .from("users")
      .update({ credits_remaining: Math.max(0, user.credits_remaining - 1) })
      .eq("id", userId);
  } else {
    // Subscription: increment usage counter
    await supabase
      .from("users")
      .update({ projects_used_this_period: (user.projects_used_this_period || 0) + 1 })
      .eq("id", userId);
  }
}
