"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface SubmissionFields {
  use_case_description: string;
  sample_message_1: string;
  sample_message_2: string;
  opt_in_description: string;
  opt_in_message: string;
  marketing_consent_checkbox?: string;
  transactional_consent_checkbox?: string;
}

interface SubmissionLanguageViewerProps {
  content: string;
  version: number;
  createdAt: string;
  projectId: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

function CopyField({ label, value, charLimit }: { label: string; value: string; charLimit?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <button
          onClick={handleCopy}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="bg-slate-50 rounded-md p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {value}
      </div>
      {charLimit && (
        <p className="text-xs text-slate-400 mt-1.5">{value.length} / {charLimit} chars</p>
      )}
    </div>
  );
}

const COMPLIANCE_CHECKLIST = [
  "My business website is live, publicly accessible, and error-free.",
  "My website clearly displays my business name and contact details (address, email, phone).",
  "Any DBA or alternate business names used are clearly disclosed on the site (if applicable).",
  "I have provided my business website URL and the opt-in form URL.",
  "My opt-in method is clearly shown (e.g., website form, QR code, paper form).",
  "My opt-in flow includes all required disclosures (message purpose, frequency, STOP/HELP, consent language).",
  "My Privacy Policy is published and accessible from the opt-in flow.",
  "My Terms of Service are published and accessible from the website.",
  "My website does not reference purchased, rented, or affiliate lead lists.",
];

export default function SubmissionLanguageViewer({
  content,
  version,
  createdAt,
  projectId,
  onRegenerate,
  regenerating,
}: SubmissionLanguageViewerProps) {
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/share-doc/submission_language`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSharing(false);
    }
  }

  let fields: SubmissionFields;
  try {
    fields = JSON.parse(content);
  } catch {
    return (
      <Card className="p-6">
        <p className="text-sm text-red-600">Error parsing submission language. Please regenerate.</p>
        {onRegenerate && (
          <Button size="sm" className="mt-3" onClick={onRegenerate} disabled={regenerating}>
            {regenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">A2P Submission Language</h2>
            <p className="text-xs text-slate-400 mt-1">
              Version {version} — Generated {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} disabled={sharing}>
              {shareCopied ? (
                <>
                  <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Link Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  {sharing ? "Generating..." : "Share Link"}
                </>
              )}
            </Button>
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
                {regenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Copy and paste these fields directly into your A2P 10DLC campaign registration form. Each field is formatted to meet carrier requirements.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">1</span>
              Campaign Details
            </h3>
            <div className="space-y-3 ml-8">
              <CopyField
                label="Use Case Description"
                value={fields.use_case_description}
                charLimit="4096"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">2</span>
              Sample Messages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
              <CopyField
                label="Sample Message #1"
                value={fields.sample_message_1}
                charLimit="1024"
              />
              <CopyField
                label="Sample Message #2"
                value={fields.sample_message_2}
                charLimit="1024"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">3</span>
              Opt-In Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
              <CopyField
                label="How do Contacts Opt-in to Messages?"
                value={fields.opt_in_description}
                charLimit="2048"
              />
              <CopyField
                label="Opt-in Message"
                value={fields.opt_in_message}
                charLimit="320"
              />
            </div>
          </div>

          {(fields.marketing_consent_checkbox || fields.transactional_consent_checkbox) && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">4</span>
                Consent Checkbox Text
              </h3>
              <p className="text-xs text-slate-500 mb-3 ml-8">
                Place these texts next to two separate, unchecked checkboxes on every form that collects a phone number. Both checkboxes must be unchecked by default.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                {fields.marketing_consent_checkbox && (
                  <CopyField
                    label="Marketing Consent Checkbox"
                    value={fields.marketing_consent_checkbox}
                  />
                )}
                {fields.transactional_consent_checkbox && (
                  <CopyField
                    label="Transactional Consent Checkbox"
                    value={fields.transactional_consent_checkbox}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Compliance Checklist */}
      <Card className="p-6 border-blue-200 bg-blue-50/50">
        <h3 className="font-semibold text-slate-900 mb-1">Business Website Compliance Checklist</h3>
        <p className="text-sm text-slate-500 mb-4">
          Ensure your opt-in form and website meets the following carrier and platform guidelines before submitting your A2P registration.
        </p>
        <div className="space-y-3">
          {COMPLIANCE_CHECKLIST.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{item}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
