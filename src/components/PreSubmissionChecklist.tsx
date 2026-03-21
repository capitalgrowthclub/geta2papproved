"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
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
    description: "The reviewer will open this URL in a browser. If it requires a login, password, account, or any authentication to access — they can't verify it and will reject. The form must be visible to anyone with the link.",
    category: "website",
  },
  {
    id: "checkboxes_visible",
    label: "SMS consent checkbox(es) are visible on my form",
    description: "The reviewer needs to see unchecked SMS consent checkboxes on the page where phone numbers are collected.",
    category: "website",
  },
  {
    id: "checkboxes_unchecked",
    label: "Consent checkboxes are NOT pre-checked by default",
    description: "Pre-checked checkboxes = automatic rejection. They must start unchecked — the user checks them.",
    category: "website",
  },
  {
    id: "consent_text_matches",
    label: "The consent text next to my checkboxes matches my submission language exactly",
    description: "The reviewer compares what's on your website to what you submitted. Any difference — even one word — gets flagged.",
    category: "website",
  },
  {
    id: "pp_tc_links_visible",
    label: "Privacy Policy and Terms & Conditions links are visible near the checkboxes",
    description: "Clickable links to both documents must be displayed on the form, near the consent checkboxes.",
    category: "website",
  },
  {
    id: "pp_tc_published",
    label: "My Privacy Policy and Terms & Conditions are published on my website",
    description: "The generated documents need to be live on your website at accessible URLs before you submit your application.",
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
    description: "Street address, suite number, city, state, zip — all must match exactly between your platform and documents.",
    category: "platform",
  },
  {
    id: "phone_matches",
    label: "My STOP/HELP phone number is the number my platform actually sends from",
    description: "The phone number in your documents must be the actual number registered on your SMS platform that sends texts.",
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
    description: "The registration portal asks if your messages contain embedded links, phone numbers, direct lending content, or age-gated content. Check the boxes as shown in your submission language section.",
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
  optinPageUrl: string;
  useCaseLabel: string | null;
  onVerifyWebsite: () => void;
  verifying: boolean;
  verificationResult: WebsiteVerificationResult | null;
}

export interface WebsiteVerificationResult {
  url: string;
  accessible: boolean;
  hasPhoneField: boolean;
  hasCheckbox: boolean;
  hasPrivacyLink: boolean;
  hasTermsLink: boolean;
  hasConsentText: boolean;
  isMultiStep?: boolean;
  rawText: string;
  issues: string[];
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
  optinPageUrl,
  useCaseLabel,
  onVerifyWebsite,
  verifying,
  verificationResult,
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

  // Auto-check website items from verification result
  // For multi-step forms, only auto-check what we can actually verify (accessibility)
  useEffect(() => {
    if (!verificationResult) return;
    const autoChecks = new Set(checked);
    if (verificationResult.accessible) autoChecks.add("website_live");

    // Only auto-check consent items if we could actually see them (not multi-step)
    if (!verificationResult.isMultiStep) {
      if (verificationResult.hasCheckbox) autoChecks.add("checkboxes_visible");
      if (verificationResult.hasPrivacyLink && verificationResult.hasTermsLink) {
        autoChecks.add("pp_tc_links_visible");
      }
    }
    setChecked(autoChecks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationResult]);

  function toggleItem(id: string) {
    const item = CHECKLIST_ITEMS.find((i) => i.id === id);
    if (item?.autoVerifiable) return; // Don't allow manual toggle of auto items
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
          {/* Website verification button */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-700">
                  Auto-verify your opt-in page
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {optinPageUrl
                    ? `We'll check ${optinPageUrl} for consent checkboxes and policy links`
                    : "Add your opt-in page URL in the questionnaire first"}
                </p>
              </div>
              {optinPageUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onVerifyWebsite}
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Checking...
                    </>
                  ) : (
                    "Verify Website"
                  )}
                </Button>
              )}
            </div>
            {verificationResult && (
              <div className="mt-2 space-y-1">
                {verificationResult.issues.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-medium">
                    No issues found on your opt-in page.
                  </p>
                ) : (
                  <>
                    {verificationResult.isMultiStep && (
                      <p className="text-xs text-slate-600 font-medium">
                        Multi-step form detected — we verified the page loads but can&apos;t check later steps automatically. Please verify the website items below manually.
                      </p>
                    )}
                    {verificationResult.issues.map((issue, i) => (
                      <p key={i} className={`text-xs ${verificationResult.isMultiStep ? "text-slate-500" : "text-amber-700"}`}>
                        {verificationResult.isMultiStep ? "ℹ" : "⚠"} {issue}
                      </p>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

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
