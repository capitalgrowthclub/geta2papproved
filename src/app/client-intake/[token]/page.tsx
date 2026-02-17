"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuestionnaireWizard from "@/components/QuestionnaireWizard";
import { a2pComplianceQuestions } from "@/lib/questionnaires/a2p-compliance";
import Card from "@/components/ui/Card";

interface IntakeData {
  link: { status: string; section: string };
  project: { name: string; business_name: string };
  section: string;
  existingAnswers: Record<string, string>;
}

export default function ClientIntakePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<IntakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/client-intake/${token}`);
        if (!res.ok) {
          setError("This link is invalid or has expired.");
          return;
        }
        const result = await res.json();
        if (result.link.status === "submitted") {
          setSubmitted(true);
        }
        setData(result);
      } catch {
        setError("Failed to load questionnaire.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  async function handleSave(answers: Record<string, string>, completed: boolean) {
    if (completed) {
      const res = await fetch(`/api/client-intake/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Link Not Found</h2>
          <p className="text-slate-500">{error}</p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg-subtle flex items-center justify-center">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Thank You!
          </h2>
          <p className="text-slate-500">
            Your business information has been submitted successfully. The person managing your A2P registration will be notified and can now continue with the process.
          </p>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold gradient-text">GetA2PApproved</span>
          <span className="text-xs text-slate-400">Client Questionnaire</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Business Information
          </h1>
          <p className="text-slate-500 mt-1">
            for <span className="font-medium text-slate-700">{data.project.business_name}</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Please fill out your basic business details below. This information will be used to generate A2P-compliant documents for your texting campaigns.
          </p>
        </div>

        <QuestionnaireWizard
          sections={a2pComplianceQuestions}
          initialAnswers={data.existingAnswers}
          onSave={handleSave}
          mode="client"
        />
      </main>
    </div>
  );
}
