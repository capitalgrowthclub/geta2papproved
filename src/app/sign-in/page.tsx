"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

type Step = "credentials" | "verify-phone";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const userPhone = data.user?.phone;
      if (!userPhone) {
        // No phone on account — go straight to dashboard
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Send OTP to the registered phone
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: userPhone,
      });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setPhone(userPhone);
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
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">
            GetA2PApproved
          </Link>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

          {step === "credentials" && (
            <form onSubmit={handleSignIn} className="space-y-4">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg rounded-lg px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Sending verification code..." : "Sign In"}
              </button>
              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/join" className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
                  Get started
                </Link>
              </p>
            </form>
          )}

          {step === "verify-phone" && (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verify your phone</h3>
              <p className="text-sm text-slate-500 mb-6">
                We sent a 6-digit code via SMS to{" "}
                <span className="font-medium text-slate-700">{phone}</span>.
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
                  {loading ? "Signing in..." : "Verify & Sign In"}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-slate-400">
                Didn&apos;t receive it? Make sure your phone is on.
              </p>
            </>
          )}

        </div>
      </div>
      </div>
      <PublicFooter />
    </div>
  );
}
