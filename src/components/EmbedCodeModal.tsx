"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface EmbedCodeModalProps {
  token: string;
  docType: "privacy_policy" | "terms_conditions";
  onClose: () => void;
}

const DOC_LABELS: Record<string, string> = {
  privacy_policy: "Privacy Policy",
  terms_conditions: "Terms & Conditions",
};

export default function EmbedCodeModal({ token, docType, onClose }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.geta2papproved.com";
  const embedCode = `<div id="a2p-doc-${token}"></div>\n<script src="${origin}/embed.js" data-token="${token}"></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Embed {DOC_LABELS[docType] || "Document"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-600">
          Paste this code into any HTML or code block in your site builder (Wix, Squarespace, WordPress, etc.). The document will load automatically and stay up to date when regenerated.
        </p>

        {/* Code block */}
        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto font-mono leading-relaxed">
            {embedCode}
          </pre>
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>The document will automatically update whenever you regenerate it — no need to re-paste the code.</p>
          <p>Works with any website builder that supports custom HTML or code blocks.</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
