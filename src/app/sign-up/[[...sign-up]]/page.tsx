import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text">GetA2PApproved</h1>
          <p className="text-slate-500 mt-2">Create your account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600",
              card: "shadow-lg border border-slate-200",
            },
          }}
        />
      </div>
    </div>
  );
}
