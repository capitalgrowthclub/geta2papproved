"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface PlanInfo {
  plan_type: string;
  credits_remaining: number;
  projects_used_this_period: number;
  project_limit: number;
  plan_label: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(true);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data))
      .catch(() => {})
      .finally(() => setCheckingPlan(false));
  }, []);

  const hasCredits = plan && (
    plan.plan_type === "single_credit" ? plan.credits_remaining > 0 :
    plan.plan_type !== "none" ? plan.projects_used_this_period < plan.project_limit :
    false
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      const data = await res.json();
      router.push(`/dashboard/project/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingPlan) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-8 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </Card>
      </div>
    );
  }

  if (!hasCredits) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
          <p className="text-slate-500 mt-1">
            You need credits to create a new project.
          </p>
        </div>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {plan?.plan_type === "none" ? "No Active Plan" : "Project Limit Reached"}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {plan?.plan_type === "none"
              ? "Purchase a credit or subscribe to a plan to start creating projects."
              : "You've used all your projects for this billing period. Upgrade your plan or wait for the next period."}
          </p>
          <Link href="/dashboard/billing">
            <Button size="lg">
              {plan?.plan_type === "none" ? "Choose a Plan" : "Upgrade Plan"}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
        <p className="text-slate-500 mt-1">
          Create a new A2P registration project for your client.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project / Client Name"
            placeholder="e.g., Acme Consulting LLC"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Enter a name to identify this project. Your client's legal business name will be collected in the questionnaire."
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} size="lg" className="flex-1">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
