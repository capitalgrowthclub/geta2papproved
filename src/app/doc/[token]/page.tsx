import { notFound } from "next/navigation";
import DocCopyButtons from "./DocCopyButtons";
import SubmissionShareFields from "./SubmissionShareFields";

interface DocData {
  document: {
    content: string;
    type: string;
    version: number;
    created_at: string;
  };
  projectName: string;
}

async function getDoc(token: string): Promise<DocData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.geta2papproved.com";
    const res = await fetch(`${baseUrl}/api/doc/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DocSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getDoc(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 mb-2">Link not found</p>
          <p className="text-slate-500">This share link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  const { document: doc, projectName } = data;
  const typeLabel =
    doc.type === "privacy_policy"
      ? "Privacy Policy"
      : doc.type === "terms_conditions"
      ? "Terms & Conditions"
      : "A2P Submission Language";

  const isSubmission = doc.type === "submission_language";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal header — branding only, no nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <span className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          GetA2PApproved
        </span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Document header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{typeLabel}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {projectName && <span>{projectName} &middot; </span>}
              Version {doc.version} &middot; Generated{" "}
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
          {!isSubmission && <DocCopyButtons content={doc.content} />}
        </div>

        {/* Document content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 overflow-auto">
          {isSubmission ? (
            <SubmissionShareFields content={doc.content} />
          ) : (
            <div
              className="document-render"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
