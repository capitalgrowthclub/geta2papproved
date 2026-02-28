"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export interface AnalysisIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  affected_documents: Array<"submission_language" | "privacy_policy" | "terms_conditions">;
  recommendation: string;
}

export interface AnalysisCheck {
  title: string;
  description: string;
}

export interface AnalysisResult {
  summary: string;
  overall_risk: "pass" | "needs_attention" | "at_risk";
  issues: AnalysisIssue[];
  checks_passed: AnalysisCheck[];
}

const SEVERITY_STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  critical: { dot: "bg-red-500", bg: "bg-red-50 border-red-200", text: "text-red-700" },
  high: { dot: "bg-orange-500", bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  medium: { dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  low: { dot: "bg-blue-500", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
};

const DOC_LABELS: Record<string, string> = {
  submission_language: "Submission Language",
  privacy_policy: "Privacy Policy",
  terms_conditions: "Terms & Conditions",
};

const RISK_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  pass: { bg: "bg-emerald-100", text: "text-emerald-700", label: "All Checks Passed" },
  needs_attention: { bg: "bg-amber-100", text: "text-amber-700", label: "Needs Attention" },
  at_risk: { bg: "bg-red-100", text: "text-red-700", label: "At Risk of Rejection" },
};

interface ComplianceAnalysisProps {
  result: AnalysisResult;
  onFixForMe: () => void;
  isFixing: boolean;
  fixingProgress: string;
}

export default function ComplianceAnalysis({
  result,
  onFixForMe,
  isFixing,
  fixingProgress,
}: ComplianceAnalysisProps) {
  const [showPassed, setShowPassed] = useState(false);

  const risk = RISK_BADGES[result.overall_risk] || RISK_BADGES.needs_attention;
  const sortedIssues = [...result.issues].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });

  return (
    <div className="space-y-4">
      {/* Risk badge + summary */}
      <div className="flex items-start gap-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${risk.bg} ${risk.text} flex-shrink-0`}>
          {result.overall_risk === "pass" && (
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {result.overall_risk === "at_risk" && (
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          )}
          {risk.label}
        </span>
        <p className="text-sm text-slate-600">{result.summary}</p>
      </div>

      {/* Issues */}
      {sortedIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-800">
            Issues Found ({sortedIssues.length})
          </h4>
          <div className="space-y-2">
            {sortedIssues.map((issue) => {
              const style = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.medium;
              return (
                <div
                  key={issue.id}
                  className={`p-3 rounded-lg border ${style.bg}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${style.text}`}>
                          {issue.title}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${style.text} opacity-70`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {issue.affected_documents.map((doc) => (
                          <span
                            key={doc}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/60 text-slate-600 border border-slate-200"
                          >
                            {DOC_LABELS[doc] || doc}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 italic mt-1.5">
                        Fix: {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fix for Me button */}
      {sortedIssues.length > 0 && (
        <div className="pt-2">
          <Button onClick={onFixForMe} disabled={isFixing}>
            {isFixing ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {fixingProgress || "Fixing..."}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.193-.14 1.743" />
                </svg>
                Fix for Me
              </>
            )}
          </Button>
          <p className="text-xs text-slate-400 mt-1.5">
            Regenerates affected documents in the correct order to resolve issues.
          </p>
        </div>
      )}

      {/* Checks passed (collapsible) */}
      {result.checks_passed.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowPassed(!showPassed)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${showPassed ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            Checks Passed ({result.checks_passed.length})
          </button>
          {showPassed && (
            <div className="mt-2 space-y-1.5">
              {result.checks_passed.map((check, i) => (
                <div key={i} className="flex items-start gap-2 pl-1">
                  <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <div>
                    <span className="text-xs font-medium text-slate-700">{check.title}</span>
                    <span className="text-xs text-slate-500 ml-1">— {check.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
