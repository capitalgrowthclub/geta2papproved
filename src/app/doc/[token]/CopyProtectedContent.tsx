"use client";

export default function CopyProtectedContent({ html }: { html: string }) {
  return (
    <div
      className="document-render select-none"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
