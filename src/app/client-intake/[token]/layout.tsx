import type { Metadata } from "next";

async function getIntakeMeta(token: string): Promise<{ businessName: string } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.geta2papproved.com";
    const res = await fetch(`${baseUrl}/api/client-intake/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return { businessName: data.project?.business_name ?? "" };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const meta = await getIntakeMeta(token);
  if (!meta?.businessName) return { title: "A2P Client Questionnaire" };

  const title = `${meta.businessName} - A2P Client Questionnaire`;
  const description = `Please fill out your business information for ${meta.businessName} so your A2P registration documents can be generated.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function ClientIntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
