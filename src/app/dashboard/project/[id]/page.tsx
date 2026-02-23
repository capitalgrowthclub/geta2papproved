"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DocumentViewer from "@/components/DocumentViewer";
import SubmissionLanguageViewer from "@/components/SubmissionLanguageViewer";
import type { Project, QuestionnaireResponse, GeneratedDocument, ClientIntakeLink } from "@/lib/supabase";
import { isProhibitedIndustry, isRestrictedIndustry, getSelectedProhibited, getSelectedRestricted } from "@/lib/questionnaires/a2p-compliance";

type DocumentType = "privacy_policy" | "terms_conditions" | "submission_language";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [clientLinks, setClientLinks] = useState<ClientIntakeLink[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "privacy" | "terms" | "submission">("overview");
  const [loading, setLoading] = useState(true);
  const [generatingPrivacy, setGeneratingPrivacy] = useState(false);
  const [generatingTerms, setGeneratingTerms] = useState(false);
  const [generatingSubmission, setGeneratingSubmission] = useState(false);
  const [errorPrivacy, setErrorPrivacy] = useState("");
  const [errorTerms, setErrorTerms] = useState("");
  const [errorSubmission, setErrorSubmission] = useState("");
  const [elapsedPrivacy, setElapsedPrivacy] = useState(0);
  const [elapsedTerms, setElapsedTerms] = useState(0);
  const [elapsedSubmission, setElapsedSubmission] = useState(0);

  // Disclaimer acknowledgment
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [acknowledgingDisclaimer, setAcknowledgingDisclaimer] = useState(false);
  const [pendingGenerateType, setPendingGenerateType] = useState<DocumentType | null>(null);

  function formatElapsed(s: number): string {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  useEffect(() => {
    if (!generatingPrivacy) { setElapsedPrivacy(0); return; }
    const interval = setInterval(() => setElapsedPrivacy((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [generatingPrivacy]);

  useEffect(() => {
    if (!generatingTerms) { setElapsedTerms(0); return; }
    const interval = setInterval(() => setElapsedTerms((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [generatingTerms]);

  useEffect(() => {
    if (!generatingSubmission) { setElapsedSubmission(0); return; }
    const interval = setInterval(() => setElapsedSubmission((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [generatingSubmission]);

  // Client link form state
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [creatingLink, setCreatingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, questRes, docRes, linkRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/questionnaire`),
          fetch(`/api/projects/${id}/documents`),
          fetch(`/api/projects/${id}/client-link`),
        ]);

        if (projRes.ok) {
          const p = (await projRes.json()).project;
          setProject(p);
          setDisclaimerAcknowledged(p.disclaimer_acknowledged ?? false);
        }
        if (questRes.ok) {
          const data = await questRes.json();
          const a2pResponse = data.responses?.find(
            (r: QuestionnaireResponse) => r.section === "a2p_compliance"
          );
          if (a2pResponse) setResponse(a2pResponse);
        }
        if (docRes.ok) setDocuments((await docRes.json()).documents || []);
        if (linkRes.ok) setClientLinks((await linkRes.json()).links || []);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleAcknowledgeDisclaimer() {
    setAcknowledgingDisclaimer(true);
    try {
      const res = await fetch(`/api/projects/${id}/acknowledge-disclaimer`, { method: "POST" });
      if (res.ok) {
        setDisclaimerAcknowledged(true);
        setShowDisclaimerModal(false);
        setDisclaimerChecked(false);
        if (pendingGenerateType) {
          const type = pendingGenerateType;
          setPendingGenerateType(null);
          // Directly trigger generation (bypasses the gate since we just set acknowledged)
          setTimeout(() => handleGenerateCore(type), 0);
        }
      }
    } catch {
      // silently fail — user can try again
    } finally {
      setAcknowledgingDisclaimer(false);
    }
  }

  async function handleGenerate(type: DocumentType) {
    if (!disclaimerAcknowledged) {
      setPendingGenerateType(type);
      setShowDisclaimerModal(true);
      return;
    }
    handleGenerateCore(type);
  }

  async function handleGenerateCore(type: DocumentType) {
    if (!response) return;

    if (type === "privacy_policy") {
      setGeneratingPrivacy(true);
      setErrorPrivacy("");
    }
    if (type === "terms_conditions") {
      setGeneratingTerms(true);
      setErrorTerms("");
    }
    if (type === "submission_language") {
      setGeneratingSubmission(true);
      setErrorSubmission("");
    }

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, type, answers: response.questions_answers }),
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [data.document, ...prev]);
      } else {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        const errMsg = data.error || "Generation failed. Please try again.";
        if (type === "privacy_policy") setErrorPrivacy(errMsg);
        if (type === "terms_conditions") setErrorTerms(errMsg);
        if (type === "submission_language") setErrorSubmission(errMsg);
      }
    } catch (error) {
      console.error("Error generating:", error);
      const errMsg = "Something went wrong. Please try again.";
      if (type === "privacy_policy") setErrorPrivacy(errMsg);
      if (type === "terms_conditions") setErrorTerms(errMsg);
      if (type === "submission_language") setErrorSubmission(errMsg);
    } finally {
      if (type === "privacy_policy") setGeneratingPrivacy(false);
      if (type === "terms_conditions") setGeneratingTerms(false);
      if (type === "submission_language") setGeneratingSubmission(false);
    }
  }

  async function handleCreateClientLink() {
    setCreatingLink(true);
    try {
      const res = await fetch(`/api/projects/${id}/client-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "a2p_compliance" }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedUrl(data.url);
        setClientLinks((prev) => [data.link, ...prev]);
        if (project) {
          setProject({ ...project, status: "waiting_for_client" });
        }
      }
    } catch (error) {
      console.error("Error creating client link:", error);
    } finally {
      setCreatingLink(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeleting(false);
    }
  }

  const privacyDoc = documents.find((d) => d.type === "privacy_policy");
  const termsDoc = documents.find((d) => d.type === "terms_conditions");
  const submissionDoc = documents.find((d) => d.type === "submission_language");
  const clientLink = clientLinks.length > 0 ? clientLinks[0] : null;
  const hasClientResponded = clientLink?.status === "submitted";
  const isQuestionnaireComplete = response?.completed === true;

  const answers = (response?.questions_answers as Record<string, string>) || {};
  const industryIsProhibited = isProhibitedIndustry(answers);
  const industryIsRestricted = isRestrictedIndustry(answers);
  const prohibitedList = getSelectedProhibited(answers);
  const restrictedList = getSelectedRestricted(answers);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-64 bg-slate-100 rounded-xl mt-6" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-lg font-semibold text-slate-900">Project not found</h2>
        <Link href="/dashboard" className="text-teal-600 hover:text-teal-700 mt-2 inline-block">Back to Projects</Link>
      </div>
    );
  }

  function renderDocCard(
    label: string,
    type: DocumentType,
    doc: GeneratedDocument | undefined,
    isGenerating: boolean,
    elapsed: number,
    tabKey: "privacy" | "terms" | "submission",
    error?: string
  ) {
    return (
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">{label}</h3>
          {isGenerating ? (
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating
            </span>
          ) : error ? (
            <span className="text-xs text-red-600 font-medium">Error</span>
          ) : doc ? (
            <span className="text-xs text-emerald-600 font-medium">Complete</span>
          ) : isQuestionnaireComplete ? (
            <span className="text-xs text-amber-600 font-medium">Ready to Generate</span>
          ) : (
            <span className="text-xs text-slate-400">Waiting for Questionnaire</span>
          )}
        </div>

        {isGenerating ? (
          <div className="py-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full gradient-bg-subtle flex items-center justify-center">
                <svg className="animate-spin w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Writing your {label.toLowerCase()}... ({formatElapsed(elapsed)})</p>
                <p className="text-xs text-slate-500">This can take 2–10 minutes. Please don&apos;t close this page.</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full gradient-bg rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        ) : error ? (
          <div className="py-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700 font-medium">Generation failed</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <Button size="sm" onClick={() => handleGenerate(type)}>
              Try Again
            </Button>
          </div>
        ) : doc ? (
          <>
            <p className="text-sm text-slate-500 mb-4 flex-1">
              Your A2P-compliant {label.toLowerCase()} is ready. Click below to review it and copy the text.
            </p>
            <div className="flex gap-2 mt-auto">
              <Button variant="secondary" size="sm" onClick={() => setActiveTab(tabKey)}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Review &amp; Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleGenerate(type)}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Regenerate
              </Button>
            </div>
          </>
        ) : isQuestionnaireComplete && industryIsProhibited ? (
          <p className="text-sm text-red-600">
            Generation unavailable — this industry is prohibited from A2P 10DLC registration.
          </p>
        ) : isQuestionnaireComplete ? (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Your questionnaire is complete. Generate your {label.toLowerCase()} now.
            </p>
            <Button size="sm" onClick={() => handleGenerate(type)}>
              Generate {label}
            </Button>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            Complete the questionnaire first to generate this document.
          </p>
        )}
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 sm:mb-8 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{project.name}</h1>
            <Badge status={project.status} />
          </div>
          <p className="text-slate-500 ml-7 sm:ml-8 text-sm truncate">{project.business_name}</p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-2"
          title="Delete project"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-900 mb-2">Delete this project?</h3>
          <p className="text-sm text-red-700 mb-4">
            This will permanently delete the project, all questionnaire answers, generated documents, and client links. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="!bg-red-600 hover:!bg-red-700 !border-red-600"
            >
              {deleting ? "Deleting..." : "Yes, Delete Project"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Disclaimer Acknowledgment Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Acknowledge Disclaimer</h3>
                <p className="text-sm text-slate-500 mt-0.5">Required before generating documents</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 text-sm text-slate-700 space-y-2">
              <p>The documents generated by GetA2PApproved are intended to assist with A2P 10DLC registration and are <strong>not a substitute for professional legal advice</strong>.</p>
              <p>We do not guarantee A2P campaign approval and are not liable for the use, publication, or outcome of generated documents. Carrier review standards may change without notice.</p>
              <p>We strongly recommend consulting with a qualified attorney before publishing any legal documents on your website. <strong>By acknowledging, you accept that the decision to use these documents is solely your responsibility.</strong></p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-5 group">
              <input
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-slate-700 leading-snug">
                I am a <strong>verified representative</strong> of this business (or am duly authorized to act on its behalf), and I acknowledge this disclaimer on my own behalf or on behalf of the business owner.
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAcknowledgeDisclaimer}
                disabled={!disclaimerChecked || acknowledgingDisclaimer}
              >
                {acknowledgingDisclaimer ? "Saving..." : "Acknowledge & Continue"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowDisclaimerModal(false); setPendingGenerateType(null); setDisclaimerChecked(false); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { key: "overview" as const, label: "Overview" },
          { key: "privacy" as const, label: "Privacy Policy" },
          { key: "terms" as const, label: "Terms & Conditions" },
          { key: "submission" as const, label: "Submission Language" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "border-teal-500 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Client Link Form */}
      {showLinkForm && (
        <Card className="p-6 mb-6 border-teal-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              Send Business Info Questionnaire to Client
            </h3>
            <button onClick={() => setShowLinkForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {generatedUrl ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Share this link with your client:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedUrl}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                />
                <Button size="sm" onClick={copyLink}>
                  {copiedLink ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Your client will only see simple business identity questions (name, address, EIN, etc.). No account required.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Generate a link for your client to fill out their basic business information. They&apos;ll only see 8 simple questions. No account needed.
              </p>
              <Button onClick={handleCreateClientLink} disabled={creatingLink}>
                {creatingLink ? "Generating Link..." : "Generate Link"}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Questionnaire Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">A2P Compliance Questionnaire</h3>
              {isQuestionnaireComplete ? (
                <span className="text-xs text-emerald-600 font-medium">Completed</span>
              ) : clientLink?.status === "pending" ? (
                <Badge status="waiting_for_client" />
              ) : hasClientResponded ? (
                <span className="text-xs text-blue-600 font-medium">Client Responded</span>
              ) : response ? (
                <span className="text-xs text-amber-600 font-medium">In Progress</span>
              ) : (
                <span className="text-xs text-slate-400">Not Started</span>
              )}
            </div>

            <p className="text-sm text-slate-500 mb-4">
              {isQuestionnaireComplete
                ? "All questions answered. Generate your documents below or edit your answers."
                : clientLink?.status === "pending"
                ? "Waiting for your client to submit their business information."
                : hasClientResponded
                ? "Your client submitted their info. Continue filling out the remaining questions."
                : "Answer questions about your SMS campaigns, compliance, and more to generate A2P-compliant documents."}
            </p>

            <div className="flex flex-wrap gap-2">
              {isQuestionnaireComplete ? (
                <Link href={`/dashboard/project/${id}/questionnaire/a2p_compliance`}>
                  <Button variant="outline" size="sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                    Edit Answers
                  </Button>
                </Link>
              ) : (
                <Link href={`/dashboard/project/${id}/questionnaire/a2p_compliance`}>
                  <Button size="sm">
                    {hasClientResponded
                      ? "Continue Questionnaire"
                      : response
                      ? "Continue Questionnaire"
                      : "Start Questionnaire"}
                  </Button>
                </Link>
              )}
              {!clientLink && !isQuestionnaireComplete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowLinkForm(true);
                    setGeneratedUrl("");
                  }}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  Send to Client
                </Button>
              )}
            </div>

            {clientLink && !isQuestionnaireComplete && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  {clientLink.status === "pending" ? (
                    <span>Client link sent{clientLink.client_name ? ` to ${clientLink.client_name}` : ""} — awaiting response</span>
                  ) : (
                    <span className="text-emerald-600">Client submitted their business info</span>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Industry restriction warnings */}
          {industryIsProhibited && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Industry Not Eligible for A2P 10DLC Registration</p>
                  <p className="text-sm text-red-700 mt-1">
                    This business operates in an industry that is <strong>fully prohibited</strong> from A2P 10DLC registration by carriers and the CTIA. Document generation is not available.
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Prohibited industry selected: {prohibitedList.join(", ")}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Prohibited industries include: cannabis/hemp, payday loans, third-party debt collection, firearms dealers, gambling/sweepstakes, and illicit drugs. These businesses cannot send A2P 10DLC messages regardless of message type.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!industryIsProhibited && industryIsRestricted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Restricted Industry — Transactional SMS Only</p>
                  <p className="text-sm text-amber-700 mt-1">
                    This business operates in a regulated industry that is permitted to register for A2P 10DLC, but is <strong>restricted to transactional messages only</strong>. Promotional or marketing SMS is not allowed. All generated documents will reflect this restriction.
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    Restricted industry selected: {restrictedList.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderDocCard("Privacy Policy", "privacy_policy", privacyDoc, generatingPrivacy, elapsedPrivacy, "privacy", errorPrivacy)}
            {renderDocCard("Terms & Conditions", "terms_conditions", termsDoc, generatingTerms, elapsedTerms, "terms", errorTerms)}
            {renderDocCard("A2P Submission Language", "submission_language", submissionDoc, generatingSubmission, elapsedSubmission, "submission", errorSubmission)}
          </div>

          {/* Legal Disclaimer */}
          {disclaimerAcknowledged ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-xs text-emerald-700 font-medium">Disclaimer acknowledged — you are authorized to generate documents for this project.</p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">Disclaimer Acknowledgment Required</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Before generating documents, you must acknowledge that generated documents are not a substitute for legal advice, that we do not guarantee A2P approval, and that you are an authorized representative of this business.
                  </p>
                  <button
                    onClick={() => setShowDisclaimerModal(true)}
                    className="mt-2 text-xs font-semibold text-amber-800 underline hover:text-amber-900 cursor-pointer"
                  >
                    Acknowledge Disclaimer →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "privacy" && (
        <div>
          {privacyDoc ? (
            <DocumentViewer
              content={privacyDoc.content}
              type="privacy_policy"
              version={privacyDoc.version}
              createdAt={privacyDoc.created_at}
              projectId={id}
              docType="privacy_policy"
              onRegenerate={() => handleGenerate("privacy_policy")}
              regenerating={generatingPrivacy}
            />
          ) : (
            <Card className="p-12 text-center">
              {generatingPrivacy ? (
                <div className="py-4">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-bg-subtle flex items-center justify-center">
                    <svg className="animate-spin w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-medium mb-1">Writing your privacy policy... ({formatElapsed(elapsedPrivacy)})</p>
                  <p className="text-sm text-slate-500">This can take 2–10 minutes. Please don&apos;t close this page.</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 mb-4">
                    {isQuestionnaireComplete
                      ? "Questionnaire complete. Generate your privacy policy."
                      : "Complete the A2P compliance questionnaire first."}
                  </p>
                  {isQuestionnaireComplete ? (
                    <Button onClick={() => handleGenerate("privacy_policy")}>
                      Generate Privacy Policy
                    </Button>
                  ) : (
                    <Link href={`/dashboard/project/${id}/questionnaire/a2p_compliance`}>
                      <Button>Start Questionnaire</Button>
                    </Link>
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      )}

      {activeTab === "terms" && (
        <div>
          {termsDoc ? (
            <DocumentViewer
              content={termsDoc.content}
              type="terms_conditions"
              version={termsDoc.version}
              createdAt={termsDoc.created_at}
              projectId={id}
              docType="terms_conditions"
              onRegenerate={() => handleGenerate("terms_conditions")}
              regenerating={generatingTerms}
            />
          ) : (
            <Card className="p-12 text-center">
              {generatingTerms ? (
                <div className="py-4">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-bg-subtle flex items-center justify-center">
                    <svg className="animate-spin w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-medium mb-1">Writing your terms &amp; conditions... ({formatElapsed(elapsedTerms)})</p>
                  <p className="text-sm text-slate-500">This can take 2–10 minutes. Please don&apos;t close this page.</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 mb-4">
                    {isQuestionnaireComplete
                      ? "Questionnaire complete. Generate your terms & conditions."
                      : "Complete the A2P compliance questionnaire first."}
                  </p>
                  {isQuestionnaireComplete ? (
                    <Button onClick={() => handleGenerate("terms_conditions")}>
                      Generate Terms &amp; Conditions
                    </Button>
                  ) : (
                    <Link href={`/dashboard/project/${id}/questionnaire/a2p_compliance`}>
                      <Button>Start Questionnaire</Button>
                    </Link>
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      )}

      {activeTab === "submission" && (
        <div>
          {submissionDoc ? (
            <SubmissionLanguageViewer
              content={submissionDoc.content}
              version={submissionDoc.version}
              createdAt={submissionDoc.created_at}
              projectId={id}
              isRestricted={industryIsRestricted}
              onRegenerate={() => handleGenerate("submission_language")}
              regenerating={generatingSubmission}
            />
          ) : (
            <Card className="p-12 text-center">
              {generatingSubmission ? (
                <div className="py-4">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full gradient-bg-subtle flex items-center justify-center">
                    <svg className="animate-spin w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-medium mb-1">Generating your A2P submission language... ({formatElapsed(elapsedSubmission)})</p>
                  <p className="text-sm text-slate-500">This can take 2–10 minutes. Please don&apos;t close this page.</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-500 mb-4">
                    {isQuestionnaireComplete
                      ? "Questionnaire complete. Generate your A2P submission language to copy into your registration form."
                      : "Complete the A2P compliance questionnaire first."}
                  </p>
                  {isQuestionnaireComplete ? (
                    <Button onClick={() => handleGenerate("submission_language")}>
                      Generate Submission Language
                    </Button>
                  ) : (
                    <Link href={`/dashboard/project/${id}/questionnaire/a2p_compliance`}>
                      <Button>Start Questionnaire</Button>
                    </Link>
                  )}
                </>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
