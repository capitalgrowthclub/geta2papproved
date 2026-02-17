"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface PlanInfo {
  plan_type: string;
  credits_remaining: number;
  projects_used_this_period: number;
  project_limit: number;
  plan_label: string;
  plan_period: string | null;
  plan_expires_at: string | null;
  has_subscription: boolean;
}

const plans = [
  {
    key: "single_credit",
    name: "Single Credit",
    price: "$47",
    period: "one-time",
    description: "1 A2P project",
    features: ["1 complete A2P project", "Privacy policy + terms & conditions", "AI-powered generation"],
  },
  {
    key: "monthly_pro",
    name: "Monthly Pro",
    price: "$97",
    period: "/month",
    description: "Up to 15 projects/month",
    features: ["Up to 15 projects per month", "Privacy policy + terms & conditions", "Client intake links", "AI-powered generation"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    key: "annual_unlimited",
    name: "Annual Unlimited",
    price: "$497",
    period: "/year",
    description: "Up to 150 projects/year",
    features: ["Up to 150 projects per year", "Privacy policy + terms & conditions", "Client intake links", "AI-powered generation", "Save 57% vs monthly"],
  },
];

export default function BillingPage() {
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [creditQty, setCreditQty] = useState(1);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout(planKey: string) {
    setCheckoutLoading(planKey);
    try {
      const body: Record<string, unknown> = { plan: planKey };
      if (planKey === "single_credit" && creditQty > 1) {
        body.quantity = creditQty;
      }
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silent failure
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silent failure
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
              <div className="h-8 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <p className="text-slate-500 mt-1">
          Manage your plan and billing
        </p>
      </div>

      {/* Current Plan */}
      {plan && plan.plan_type !== "none" && (
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Current Plan</p>
              <p className="text-lg font-semibold text-slate-900">{plan.plan_label}</p>
              {plan.plan_type === "single_credit" ? (
                <p className="text-sm text-slate-600 mt-1">
                  {plan.credits_remaining} credit{plan.credits_remaining !== 1 ? "s" : ""} remaining
                </p>
              ) : (
                <p className="text-sm text-slate-600 mt-1">
                  {plan.projects_used_this_period} of {plan.project_limit} projects used this {plan.plan_period}
                </p>
              )}
              {plan.plan_expires_at && (
                <p className="text-xs text-slate-400 mt-1">
                  {plan.has_subscription ? "Renews" : "Expires"} {new Date(plan.plan_expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
            {plan.has_subscription && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="self-start sm:self-center"
              >
                {portalLoading ? "Loading..." : "Manage Subscription"}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Plan Options */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        {plan?.plan_type === "none" ? "Choose a Plan" : "Change Plan"}
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((tier) => {
          const isCurrentPlan = plan?.plan_type === tier.key;
          return (
            <div
              key={tier.key}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.highlighted
                  ? "border-teal-400 ring-2 ring-teal-400"
                  : "border-slate-200"
              } ${isCurrentPlan ? "bg-teal-50" : "bg-white"}`}
            >
              {tier.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {tier.badge}
                </span>
              )}
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-500">{tier.name}</p>
                {tier.key === "single_credit" ? (
                  <>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      ${47 * creditQty}
                    </p>
                    <p className="text-sm text-slate-500">
                      {creditQty > 1 ? `$47 x ${creditQty} credits` : "one-time"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{tier.price}</p>
                    <p className="text-sm text-slate-500">{tier.period}</p>
                  </>
                )}
              </div>
              <ul className="space-y-2 text-sm text-slate-600 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">&#10003;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {tier.key === "single_credit" && !isCurrentPlan && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setCreditQty(Math.max(1, creditQty - 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold text-slate-900 w-8 text-center">{creditQty}</span>
                  <button
                    type="button"
                    onClick={() => setCreditQty(Math.min(10, creditQty + 1))}
                    className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
              {isCurrentPlan ? (
                <Button variant="outline" disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant={tier.highlighted ? "primary" : "secondary"}
                  onClick={() => handleCheckout(tier.key)}
                  disabled={checkoutLoading === tier.key}
                  className="w-full"
                >
                  {checkoutLoading === tier.key ? "Loading..." : tier.key === "single_credit" ? `Buy ${creditQty} Credit${creditQty > 1 ? "s" : ""}` : "Subscribe"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
