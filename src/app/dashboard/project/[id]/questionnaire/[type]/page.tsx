"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import QuestionnaireWizard from "@/components/QuestionnaireWizard";
import { a2pComplianceQuestions } from "@/lib/questionnaires/a2p-compliance";

export default function QuestionnairePage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const router = useRouter();
  const [initialAnswers, setInitialAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExisting() {
      try {
        const res = await fetch(`/api/projects/${id}/questionnaire`);
        if (res.ok) {
          const data = await res.json();
          const existing = data.responses?.find(
            (r: { section: string }) => r.section === type
          );
          if (existing) {
            setInitialAnswers(existing.questions_answers || {});
          }
        }
      } catch (error) {
        console.error("Error fetching questionnaire:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExisting();
  }, [id, type]);

  async function handleSave(answers: Record<string, string>, completed: boolean) {
    await fetch(`/api/projects/${id}/questionnaire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: type,
        questions_answers: answers,
        completed,
      }),
    });

    if (completed) {
      router.push(`/dashboard/project/${id}`);
    }
  }

  async function handleGenerate(answers: Record<string, string>) {
    // Save first
    await fetch(`/api/projects/${id}/questionnaire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: type,
        questions_answers: answers,
        completed: true,
      }),
    });

    // Generate both documents
    await Promise.all([
      fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, type: "privacy_policy", answers }),
      }),
      fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, type: "terms_conditions", answers }),
      }),
    ]);

    router.push(`/dashboard/project/${id}`);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-96 bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Link
            href={`/dashboard/project/${id}`}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            A2P Compliance Questionnaire
          </h1>
        </div>
        <p className="text-slate-500 ml-8">
          Answer these questions to generate your A2P-compliant privacy policy and terms &amp; conditions.
        </p>
      </div>

      <QuestionnaireWizard
        sections={a2pComplianceQuestions}
        initialAnswers={initialAnswers}
        onSave={handleSave}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
