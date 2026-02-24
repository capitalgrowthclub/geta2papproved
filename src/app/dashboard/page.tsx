"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Project } from "@/lib/supabase";

interface PlanInfo {
  plan_type: string;
  credits_remaining: number;
  projects_used_this_period: number;
  project_limit: number;
  plan_label: string;
  has_subscription: boolean;
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanInfo | null>(null);

  // Auto-trigger checkout when redirected from sign-up with a plan
  useEffect(() => {
    const checkoutPlan = searchParams.get("checkout");
    if (!checkoutPlan) return;

    // Clean the URL so it doesn't re-trigger
    router.replace("/dashboard", { scroll: false });

    async function startCheckout() {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: checkoutPlan }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Auto-checkout failed:", error);
      }
    }
    startCheckout();
  }, [searchParams, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, planRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/user/plan"),
        ]);
        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(data.projects || []);
        }
        if (planRes.ok) {
          setPlan(await planRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const hasCredits = plan && (
    plan.plan_type === "single_credit" ? plan.credits_remaining > 0 :
    plan.plan_type !== "none" ? plan.projects_used_this_period < plan.project_limit :
    false
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Manage your A2P registration projects
          </p>
        </div>
        {hasCredits ? (
          <Link href="/dashboard/new-project">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Project
            </Button>
          </Link>
        ) : plan && plan.plan_type !== "none" ? null : null}
      </div>

      {/* Plan Status Card */}
      {plan && (plan.has_subscription || plan.credits_remaining > 0) && (
        <Card className="p-4 sm:p-6 mb-6 border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border border-teal-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                {plan.has_subscription && (
                  <div>
                    <p className="text-sm font-medium text-teal-800">{plan.plan_label}</p>
                    {plan.plan_type === "annual_unlimited" ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-900">Infinity Go Crazy</span>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">
                            {plan.project_limit - plan.projects_used_this_period}
                          </span>
                          <span className="text-sm text-slate-500">
                            of {plan.project_limit} projects remaining
                          </span>
                        </div>
                        <div className="w-full max-w-xs sm:w-48 bg-white rounded-full h-2 mt-2 border border-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
                            style={{ width: `${Math.min((plan.projects_used_this_period / plan.project_limit) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {plan.projects_used_this_period} of {plan.project_limit} used this period
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {plan.credits_remaining > 0 && (
                  <div className={plan.has_subscription ? "sm:border-l sm:border-teal-200 sm:pl-8" : ""}>
                    <p className="text-sm font-medium text-teal-800">Single Credits</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-slate-900">{plan.credits_remaining}</span>
                      <span className="text-sm text-slate-500">credit{plan.credits_remaining !== 1 ? "s" : ""} remaining</span>
                    </div>
                    {plan.has_subscription && (
                      <p className="text-xs text-slate-400 mt-1">Used first before subscription</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Link href="/dashboard/billing" className="self-start sm:self-center">
              <Button variant="outline" size="sm">Manage Plan</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Upgrade Banner */}
      {plan && plan.plan_type === "none" && (
        <Card className="p-4 sm:p-6 mb-6 border-amber-200 bg-amber-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Choose a plan to create projects</h3>
              <p className="text-sm text-slate-600 mt-1">
                Purchase a credit or subscribe to start generating A2P compliant documents.
              </p>
            </div>
            <Link href="/dashboard/billing" className="self-start sm:self-center">
              <Button>Choose a Plan</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Limit Reached Banner */}
      {plan && plan.plan_type !== "none" && !hasCredits && (
        <Card className="p-4 sm:p-6 mb-6 border-amber-200 bg-amber-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">You&apos;ve reached your project limit</h3>
              <p className="text-sm text-slate-600 mt-1">
                Upgrade your plan or wait for the next billing period to create more projects.
              </p>
            </div>
            <Link href="/dashboard/billing" className="self-start sm:self-center">
              <Button>Upgrade</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-6 bg-slate-100 rounded w-20" />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg-subtle flex items-center justify-center">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No projects yet
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {hasCredits
              ? "Create your first A2P registration project to generate a compliant privacy policy and terms & conditions."
              : "Choose a plan to get started with generating A2P compliant documents."}
          </p>
          {hasCredits ? (
            <Link href="/dashboard/new-project">
              <Button size="lg">Create Your First Project</Button>
            </Link>
          ) : (
            <Link href="/dashboard/billing">
              <Button size="lg">Choose a Plan</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/project/${project.id}`}>
              <Card hover className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {project.business_name}
                    </p>
                  </div>
                  <Badge status={project.status} />
                </div>
                <p className="text-xs text-slate-400">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
