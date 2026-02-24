"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

const PLANS: Record<string, { name: string; price: string; period: string; description: string }> = {
  single_credit: {
    name: "Single Credit",
    price: "$47",
    period: "one-time",
    description: "1 A2P Project — privacy policy, terms & conditions, and A2P submission language",
  },
  monthly_pro: {
    name: "Monthly Pro",
    price: "$97",
    period: "/month",
    description: "Up to 8 projects per month — perfect for agencies",
  },
  annual_unlimited: {
    name: "Annual Unlimited",
    price: "$497",
    period: "/year",
    description: "Unlimited projects — best value for high-volume agencies",
  },
};

type Step = "signup" | "verify-phone";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  return `+${digits}`;
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Create Account", "Verify Phone"];
  const stepIndex = step === "signup" ? 0 : 1;
  return (
    <div className="flex items-center gap-1 mt-6 pt-6 border-t border-slate-100">
      {steps.map((label, i) => {
        const done = i < stepIndex;
        const active = i === stepIndex;
        return (
          <div key={label} className="flex items-center gap-1">
            {i > 0 && <div className="w-4 h-px bg-slate-200 mx-1" />}
            <div className={`flex items-center gap-1 text-xs font-medium ${
              done ? "text-teal-600" : active ? "text-slate-900" : "text-slate-400"
            }`}>
              {done ? (
                <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                  active ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-400"
                }`}>{i + 1}</span>
              )}
              <span>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JoinContent() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "single_credit";
  const plan = PLANS[planKey] || PLANS.single_credit;

  const [step, setStep] = useState<Step>("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [serviceConsent, setServiceConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const e164 = formatPhone(phone);

      // Send OTP to phone — no account created yet
      const res = await fetch("/api/auth/send-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: e164 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to send verification code.");
        return;
      }

      setFormattedPhone(e164);
      setStep("verify-phone");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhone(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Verify OTP + create account only on success
      const verifyRes = await fetch("/api/auth/verify-and-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          otp,
          email,
          password,
          firstName,
          lastName,
        }),
      });
      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok) {
        setError(verifyJson.error || "Verification failed. Please try again.");
        return;
      }

      // Account created — now sign in to get a session
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Authenticated — proceed to Stripe
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const checkoutJson = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutJson.url) {
        setError(checkoutJson.error || "Failed to start checkout. Please try again.");
        return;
      }
      window.location.href = checkoutJson.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold gradient-text">
              GetA2PApproved
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Plan summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-2">You selected</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{plan.name}</h2>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-slate-500 text-sm">{plan.period}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

            <ul className="space-y-3 text-sm">
              {[
                "Privacy Policy with A2P compliance language",
                "Terms & Conditions with SMS disclosures",
                "A2P Submission Language (copy-paste ready)",
                "Consent checkbox language for your forms",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-slate-600">{f}</span>
                </li>
              ))}
            </ul>

            <StepIndicator step={step} />
          </div>

          {/* Right panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            {step === "signup" && (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Create your account</h3>
                <p className="text-sm text-slate-500 mb-6">
                  We&apos;ll verify your phone number before creating your account.
                </p>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jane"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Smith"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                    <p className="text-xs text-slate-400 mt-1">US numbers only. We&apos;ll send a verification code via SMS.</p>
                  </div>

                  {/* SMS Consent Checkboxes */}
                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I agree to receive marketing texts from GetA2PApproved LLC (e.g. offers, new features, compliance tips). Up to 8 msgs/mo. Msg &amp; data rates may apply. Reply STOP to cancel. Reply HELP for info. Consent not required for purchase. SMS opt-in data is never shared with third parties.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceConsent}
                        onChange={(e) => setServiceConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I agree to receive service texts from GetA2PApproved LLC (e.g. order confirmations, payment receipts, document delivery, project status updates). Msgs sent only when triggered by account activity. Msg &amp; data rates may apply. Reply STOP to cancel. Reply HELP for info. SMS opt-in data is never shared with third parties.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-bg rounded-lg px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? "Sending verification code..." : "Continue"}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
                    Sign in
                  </Link>
                </p>
                <p className="mt-4 text-center text-xs text-slate-400">
                  By creating an account you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link href="/terms" className="underline hover:text-slate-600 transition-colors">Terms &amp; Conditions</Link>.
                </p>
              </>
            )}

            {step === "verify-phone" && (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verify your phone</h3>
                <p className="text-sm text-slate-500 mb-6">
                  We sent a 6-digit code via SMS to{" "}
                  <span className="font-medium text-slate-700">{phone}</span>.
                  Your account will be created once verified.
                </p>
                <form onSubmit={handleVerifyPhone} className="space-y-4">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                      Verification code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      autoFocus
                      autoComplete="one-time-code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-2xl font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full gradient-bg rounded-lg px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? "Creating account..." : `Verify & Pay ${plan.price}`}
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-slate-400">
                  Didn&apos;t receive it? Make sure your number is a US mobile number.
                </p>
              </>
            )}

          </div>
        </div>
      </div>
      </div>
      <PublicFooter />
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
