"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const redirectUrl = plan
    ? `/dashboard?checkout=${plan}`
    : "/dashboard";

  return (
    <SignUp
      forceRedirectUrl={redirectUrl}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600",
          card: "shadow-lg border border-slate-200",
          rootBox: "w-full flex justify-center",
        },
      }}
    />
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text">GetA2PApproved</h1>
          <p className="text-slate-500 mt-2">Create your account</p>
        </div>
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
