"use client";

import { useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmbedCodeModal from "@/components/EmbedCodeModal";

interface DocumentViewerProps {
  content: string;
  type: "privacy_policy" | "terms_conditions";
  version: number;
  createdAt: string;
  projectId: string;
  docType: "privacy_policy" | "terms_conditions";
  documentId: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
  onContentUpdated?: (content: string) => void;
}

export default function DocumentViewer({
  content,
  type,
  version,
  createdAt,
  projectId,
  docType,
  documentId,
  onRegenerate,
  regenerating,
  onContentUpdated,
}: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/share-doc/${docType}`, {
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

  async function handleEmbed() {
    if (embedToken) {
      setShowEmbedModal(true);
      return;
    }
    setLoadingEmbed(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/share-doc/${docType}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        // Extract token from URL (last path segment)
        const urlToken = data.url.split("/").pop();
        if (urlToken) {
          setEmbedToken(urlToken);
          setShowEmbedModal(true);
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoadingEmbed(false);
    }
  }

  const typeLabel = type === "privacy_policy" ? "Privacy Policy" : "Terms & Conditions";

  function handleEdit() {
    setEditing(true);
  }

  function handleCancelEdit() {
    if (contentRef.current) {
      contentRef.current.innerHTML = content;
    }
    setEditing(false);
  }

  async function handleSave() {
    if (!contentRef.current) return;
    setSaving(true);
    try {
      const newContent = contentRef.current.innerHTML;
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, content: newContent }),
      });
      if (res.ok) {
        onContentUpdated?.(newContent);
        setEditing(false);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      // Copy as both HTML and plain text
      const blob = new Blob([content], { type: "text/html" });
      const plainBlob = new Blob([content.replace(/<[^>]*>/g, "")], { type: "text/plain" });

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": plainBlob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to plain text copy
      const tempEl = document.createElement("div");
      tempEl.innerHTML = content;
      await navigator.clipboard.writeText(tempEl.textContent || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{typeLabel}</h3>
          <p className="text-xs text-slate-500">
            Version {version} &middot; Generated{" "}
            {new Date(createdAt).toLocaleDateString()}
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
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
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
              <Button variant="outline" size="sm" onClick={handleEmbed} disabled={loadingEmbed}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
                {loadingEmbed ? "Loading..." : "Embed Code"}
              </Button>
              {onRegenerate && (
                <Button size="sm" onClick={onRegenerate} disabled={regenerating}>
                  {regenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                      Regenerate
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Document Content */}
      <Card className={`p-8 overflow-auto ${editing ? "ring-2 ring-teal-300" : ""}`}>
        {editing ? (
          <div
            ref={contentRef}
            className="document-render outline-none"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div
            className="document-render select-none"
            style={{ WebkitUserSelect: "none", userSelect: "none" }}
            onCopy={(e) => e.preventDefault()}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </Card>

      {/* Embed Code Modal */}
      {showEmbedModal && embedToken && (
        <EmbedCodeModal
          token={embedToken}
          docType={docType}
          onClose={() => setShowEmbedModal(false)}
        />
      )}
    </div>
  );
}
