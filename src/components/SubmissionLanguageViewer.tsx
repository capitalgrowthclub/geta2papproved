"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ContentDeclarations {
  embedded_links?: boolean;
  embedded_phone?: boolean;
  direct_lending?: boolean;
  age_gated?: boolean;
  [key: string]: boolean | string | undefined;
}

interface SubmissionFields {
  use_case_description: string;
  sample_message_1: string;
  sample_message_2: string;
  opt_in_description: string;
  opt_in_message: string;
  marketing_consent_checkbox?: string;
  transactional_consent_checkbox?: string;
  form_secondary_text?: string;
  content_declarations?: ContentDeclarations;
  opt_in_keywords?: string;
}

interface SubmissionLanguageViewerProps {
  content: string;
  version: number;
  createdAt: string;
  projectId: string;
  documentId: string;
  isRestricted?: boolean;
  onRegenerate?: () => void;
  regenerating?: boolean;
  onContentUpdated?: (content: string) => void;
}

function CopyField({ label, value, charLimit, editing, onChange }: { label: string; value: string; charLimit?: string; editing?: boolean; onChange?: (value: string) => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`border rounded-lg p-4 ${editing ? "border-teal-300" : "border-slate-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        {!editing && (
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
        )}
      </div>
      {editing ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-md p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-300 resize-y min-h-[80px]"
          rows={Math.max(3, value.split("\n").length + 1)}
        />
      ) : (
        <div className="bg-slate-50 rounded-md p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {value}
        </div>
      )}
      {charLimit && (
        <p className="text-xs text-slate-400 mt-1.5">{value.length} / {charLimit} chars</p>
      )}
    </div>
  );
}

function isRestrictedNotice(value: string | undefined | null): boolean {
  if (!value) return false;
  return value.startsWith("Not applicable") || value.startsWith("N/A");
}

export default function SubmissionLanguageViewer({
  content,
  version,
  createdAt,
  projectId,
  documentId,
  isRestricted,
  onRegenerate,
  regenerating,
  onContentUpdated,
}: SubmissionLanguageViewerProps) {
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedFields, setEditedFields] = useState<SubmissionFields | null>(null);

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

  function handleEdit() {
    try {
      setEditedFields(JSON.parse(content));
      setEditing(true);
    } catch {
      // can't edit if content is unparseable
    }
  }

  function handleCancelEdit() {
    setEditedFields(null);
    setEditing(false);
  }

  function updateField(key: keyof SubmissionFields, value: string) {
    if (!editedFields) return;
    setEditedFields({ ...editedFields, [key]: value });
  }

  async function handleSave() {
    if (!editedFields) return;
    setSaving(true);
    try {
      const newContent = JSON.stringify(editedFields);
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, content: newContent }),
      });
      if (res.ok) {
        onContentUpdated?.(newContent);
        setEditing(false);
        setEditedFields(null);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
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
            {editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Edit
                </Button>
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
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          {editing
            ? "Edit the fields below and click Save Changes when done."
            : "Copy and paste these fields directly into your A2P 10DLC campaign registration form. Each field is formatted to meet carrier requirements."}
        </p>

        {(() => {
          const f = editing && editedFields ? editedFields : fields;
          return (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">1</span>
                  Campaign Details
                </h3>
                <div className="space-y-3 ml-8">
                  <CopyField
                    label="Use Case Description"
                    value={f.use_case_description}
                    charLimit="4096"
                    editing={editing}
                    onChange={(v) => updateField("use_case_description", v)}
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
                    value={f.sample_message_1}
                    charLimit="1024"
                    editing={editing}
                    onChange={(v) => updateField("sample_message_1", v)}
                  />
                  <CopyField
                    label="Sample Message #2"
                    value={f.sample_message_2}
                    charLimit="1024"
                    editing={editing}
                    onChange={(v) => updateField("sample_message_2", v)}
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
                    value={f.opt_in_description}
                    charLimit="2048"
                    editing={editing}
                    onChange={(v) => updateField("opt_in_description", v)}
                  />
                  <CopyField
                    label="Opt-in Message"
                    value={f.opt_in_message}
                    charLimit="320"
                    editing={editing}
                    onChange={(v) => updateField("opt_in_message", v)}
                  />
                </div>
              </div>

              {(f.marketing_consent_checkbox || f.transactional_consent_checkbox || isRestricted) && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">4</span>
                    Consent Checkbox Text
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 ml-8">
                    Place these texts next to two separate, unchecked checkboxes on every form that collects a phone number. Both checkboxes must be unchecked by default.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                    {(isRestricted || f.marketing_consent_checkbox) && (
                      isRestrictedNotice(f.marketing_consent_checkbox) || (isRestricted && !f.marketing_consent_checkbox) ? (
                        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                          <h4 className="text-sm font-semibold text-amber-800 mb-2">Marketing Consent Checkbox</h4>
                          <p className="text-sm text-amber-700">
                            <strong>Not applicable for this business.</strong> This business operates in a regulated industry that is restricted to transactional messages only per CTIA and carrier guidelines. Promotional or marketing SMS is not permitted — do not include a marketing consent checkbox on your opt-in forms.
                          </p>
                        </div>
                      ) : (
                        <CopyField
                          label="Marketing Consent Checkbox"
                          value={f.marketing_consent_checkbox!}
                          editing={editing}
                          onChange={(v) => updateField("marketing_consent_checkbox", v)}
                        />
                      )
                    )}
                    {f.transactional_consent_checkbox && (
                      <CopyField
                        label="Transactional Consent Checkbox"
                        value={f.transactional_consent_checkbox}
                        editing={editing}
                        onChange={(v) => updateField("transactional_consent_checkbox", v)}
                      />
                    )}
                  </div>
                </div>
              )}

              {f.form_secondary_text && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">5</span>
                    Form Secondary Text
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 ml-8">
                    Place this text block below both consent checkboxes on your opt-in forms. This is required by carrier reviewers to verify your form meets MESSAGE_FLOW compliance.
                  </p>
                  <div className="ml-8">
                    <CopyField
                      label="Secondary Disclosure Text (Below Checkboxes)"
                      value={f.form_secondary_text}
                      editing={editing}
                      onChange={(v) => updateField("form_secondary_text", v)}
                    />
                  </div>
                </div>
              )}

              {/* Content Declarations */}
              {f.content_declarations && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">6</span>
                    Content Declaration Checkboxes
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 ml-8">
                    During campaign registration, you&apos;ll be asked whether your messages contain these content types. Select the checkboxes as shown below.
                  </p>
                  <div className="ml-8 space-y-2">
                    {Object.entries(f.content_declarations).map(([key, value]) => {
                      if (typeof value === "string") return null;
                      const labels: Record<string, string> = {
                        embedded_links: "Embedded Links",
                        embedded_phone: "Embedded Phone Numbers",
                        direct_lending: "Direct Lending or Loan Content",
                        age_gated: "Age-Gated Content",
                      };
                      return (
                        <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${value ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-400"}`}>
                            {value ? "✓" : "✗"}
                          </span>
                          <div>
                            <span className="text-sm font-medium text-slate-700">{labels[key] || key}</span>
                            <span className={`ml-2 text-xs font-semibold ${value ? "text-teal-600" : "text-slate-400"}`}>
                              {value ? "YES — check this" : "NO — leave unchecked"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Opt-in Keywords */}
              {f.opt_in_keywords && f.opt_in_keywords !== "N/A — this business uses web-based opt-in only." && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">7</span>
                    Opt-In Keywords
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 ml-8">
                    If your registration portal asks for opt-in keywords, enter these.
                  </p>
                  <div className="ml-8">
                    <CopyField
                      label="Opt-In Keyword"
                      value={f.opt_in_keywords}
                      editing={editing}
                      onChange={(v) => updateField("opt_in_keywords", v)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Card>

    </div>
  );
}
