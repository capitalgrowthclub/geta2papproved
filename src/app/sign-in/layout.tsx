import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | GetA2PApproved",
  description:
    "Sign in to your GetA2PApproved account to manage your A2P 10DLC compliance documents, generate policies, and track campaign registrations.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
