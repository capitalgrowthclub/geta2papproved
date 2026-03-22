"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: "website" | "platform" | "documents";
  autoVerifiable?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Website verification
  {
    id: "website_live",
    label: "My opt-in page is publicly accessible — no login, password, or account required",
    description: "The reviewer will visit this URL. If it requires any authentication, they can't verify it and will reject.",
    category: "website",
  },
  {
    id: "checkboxes_visible",
    label: "SMS consent checkbox(es) are visible on my form",
    description: "Unchecked SMS consent checkboxes must be visible on the page where phone numbers are collected.",
    category: "website",
  },
  {
    id: "checkboxes_unchecked",
    label: "Consent checkboxes are NOT pre-checked by default",
    description: "Pre-checked checkboxes = automatic rejection. They must start unchecked.",
    category: "website",
  },
  {
    id: "consent_text_matches",
    label: "The consent text next to my checkboxes matches my submission language exactly",
    description: "The reviewer compares your website to your submission. Any difference — even one word — gets flagged.",
    category: "website",
  },
  {
    id: "pp_tc_links_visible",
    label: "Privacy Policy and Terms & Conditions links are visible near the checkboxes",
    description: "Clickable links to both documents must be on the form, near the consent checkboxes.",
    category: "website",
  },
  {
    id: "pp_tc_published",
    label: "My Privacy Policy and Terms & Conditions are published on my website",
    description: "The generated documents need to be live at accessible URLs before you submit.",
    category: "website",
  },
  // Platform verification
  {
    id: "business_name_matches",
    label: "My business name on my SMS platform matches my documents exactly",
    description: "The legal business name on your GoHighLevel/Twilio brand registration must match character-for-character.",
    category: "platform",
  },
  {
    id: "ein_matches",
    label: "My EIN on my platform registration matches my documents",
    description: "The EIN you registered with must match what's in your compliance documents and IRS records.",
    category: "platform",
  },
  {
    id: "address_matches",
    label: "My business address on my platform matches my documents",
    description: "Street address, suite number, city, state, zip — all must match exactly.",
    category: "platform",
  },
  {
    id: "phone_matches",
    label: "My STOP/HELP phone number is the number my platform actually sends from",
    description: "The phone number in your documents must be the actual number registered on your SMS platform.",
    category: "platform",
  },
  {
    id: "use_case_selected",
    label: "I will select the recommended use case in the registration portal",
    description: "When filling out the A2P registration, select the exact use case shown on your submission language tab.",
    category: "platform",
  },
  {
    id: "content_declarations_checked",
    label: "I will select the correct content declaration checkboxes during registration",
    description: "Check the content declaration boxes (embedded links, phone numbers, direct lending, age-gated) as shown in your submission language.",
    category: "platform",
  },
  // Document verification
  {
    id: "all_docs_generated",
    label: "All three documents are generated (Submission Language, Privacy Policy, Terms & Conditions)",
    description: "You need all three before submitting your A2P registration.",
    category: "documents",
    autoVerifiable: true,
  },
  {
    id: "analysis_passed",
    label: "AI compliance analysis shows no critical or high issues",
    description: "Run the AI analysis and resolve all critical and high severity issues before submitting.",
    category: "documents",
    autoVerifiable: true,
  },
];

interface PreSubmissionChecklistProps {
  answers: Record<string, string>;
  hasAllDocs: boolean;
  analysisScore: number | null;
  analysisRisk: string | null;
  useCaseLabel: string | null;
}

const CATEGORY_LABELS: Record<string, { title: string; icon: string }> = {
  website: { title: "Website & Forms", icon: "🌐" },
  platform: { title: "Platform Registration", icon: "📱" },
  documents: { title: "Documents", icon: "📄" },
};

export default function PreSubmissionChecklist({
  answers,
  hasAllDocs,
  analysisScore,
  analysisRisk,
  useCaseLabel,
}: PreSubmissionChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  // Auto-check items that can be verified programmatically
  useEffect(() => {
    const autoChecks = new Set(checked);
    if (hasAllDocs) autoChecks.add("all_docs_generated");
    else autoChecks.delete("all_docs_generated");

    if (analysisRisk === "pass" || (analysisScore !== null && analysisScore >= 90)) {
      autoChecks.add("analysis_passed");
    } else {
      autoChecks.delete("analysis_passed");
    }

    setChecked(autoChecks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAllDocs, analysisRisk, analysisScore]);

  function toggleItem(id: string) {
    const item = CHECKLIST_ITEMS.find((i) => i.id === id);
    if (item?.autoVerifiable) return;
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  }

  const totalItems = CHECKLIST_ITEMS.length;
  const checkedCount = checked.size;
  const allChecked = checkedCount === totalItems;
  const readinessPercent = Math.round((checkedCount / totalItems) * 100);

  const categories = ["website", "platform", "documents"] as const;

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            allChecked
              ? "bg-emerald-100 text-emerald-700"
              : readinessPercent >= 70
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}>
            {readinessPercent}%
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-slate-800">
              Pre-Submission Readiness
            </h3>
            <p className="text-xs text-slate-500">
              {allChecked
                ? "All checks complete — ready to submit"
                : `${checkedCount} of ${totalItems} items verified`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allChecked && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Ready
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100">
          {/* Checklist by category */}
          {categories.map((cat) => {
            const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
            const catLabel = CATEGORY_LABELS[cat];
            return (
              <div key={cat} className="border-b border-slate-100 last:border-b-0">
                <div className="px-4 py-2 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {catLabel.icon} {catLabel.title}
                  </p>
                </div>
                <div className="divide-y divide-slate-50">
                  {items.map((item) => {
                    const isChecked = checked.has(item.id);
                    const isAuto = item.autoVerifiable;
                    // Show contextual info for certain items
                    let contextInfo = "";
                    if (item.id === "use_case_selected" && useCaseLabel) {
                      contextInfo = `Select: "${useCaseLabel}"`;
                    }
                    if (item.id === "business_name_matches") {
                      contextInfo = `Must match: "${answers.legal_business_name || ""}"`;
                    }
                    if (item.id === "ein_matches" && answers.ein_number) {
                      contextInfo = `Must match: ${answers.ein_number}`;
                    }
                    if (item.id === "phone_matches" && answers.stop_help_number) {
                      contextInfo = `Number: ${answers.stop_help_number}`;
                    }
                    if (item.id === "address_matches" && answers.business_address) {
                      contextInfo = `Must match: ${answers.business_address}`;
                    }

                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                          isAuto ? "opacity-80" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          disabled={isAuto}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer disabled:cursor-default"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isChecked ? "text-slate-500 line-through" : "text-slate-800"}`}>
                            {item.label}
                            {isAuto && (
                              <span className="ml-1.5 text-[10px] font-medium text-teal-600 no-underline">
                                AUTO
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                          {contextInfo && (
                            <p className="text-xs text-teal-600 font-medium mt-0.5">{contextInfo}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom status */}
          {allChecked && (
            <div className="p-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Ready to submit your A2P registration</p>
                  <p className="text-xs text-emerald-600 mt-0.5">All pre-submission checks verified. Copy your submission language fields into the registration portal.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
