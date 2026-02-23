import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industry Eligibility for A2P 10DLC Registration | GetA2PApproved",
  description:
    "Find out if your industry is eligible for A2P 10DLC SMS registration. Some industries are fully prohibited, others are restricted to transactional messages only.",
};

const prohibitedIndustries = [
  {
    name: "Cannabis or Hemp",
    reason:
      "Blocked at the carrier level entirely. No messages of any kind — promotional or transactional — are permitted. Carriers will reject registration regardless of consent obtained.",
  },
  {
    name: "Payday Loans",
    reason:
      "The entire business category is rejected at registration. Payment reminders, due date alerts, and account status updates are blocked along with promotional messages.",
  },
  {
    name: "Third-Party Debt Collection",
    reason:
      "Blocked due to FDCPA conflicts and high consumer complaint rates. Even legitimate debt status notifications are prohibited — carriers will not approve this use case.",
  },
  {
    name: "Gambling & Sweepstakes",
    reason:
      "Commercial gambling operations are blocked entirely. Very narrow exceptions exist for state-licensed lottery systems only.",
  },
  {
    name: "Firearms Dealers",
    reason:
      "Promotional messaging is prohibited. Some narrow transactional use cases (e.g., background check status) may be considered for licensed dealers on a case-by-case basis.",
  },
  {
    name: "Illicit Drugs / Controlled Substances",
    reason:
      "No exceptions. All message types are fully blocked at the carrier level.",
  },
];

const restrictedIndustries = [
  {
    name: "Mortgage Lending & Brokerage",
    regulation: "RESPA, TILA, Regulation Z",
    prohibited: [
      "Rate quote blasts (e.g., '30-year fixed at 6.5% — call us today')",
      "Pre-approval solicitations to cold or purchased leads",
      "Refinance campaign messages",
      "Cash-out equity promotions",
      "Urgency-based rate lock offers",
    ],
    allowed: [
      "Application receipt confirmations",
      "Rate lock confirmations tied to an active borrower file",
      "Document checklist requests for open loan files",
      "Underwriting status updates",
      "Closing date confirmations and funding notifications",
      "Payment reminders for active loan agreements",
    ],
  },
  {
    name: "Banking & Credit Unions",
    regulation: "Gramm-Leach-Bliley Act, FDIC/NCUA regulations",
    prohibited: [
      "New account promotions",
      "Credit card offer solicitations",
      "Loan product advertisements",
      "Promotional interest rate offers",
      "Cross-sell messages for additional products",
    ],
    allowed: [
      "Account balance and transaction alerts",
      "Fraud detection and suspicious activity notifications",
      "Low balance warnings",
      "Wire transfer confirmations",
      "Password reset and security verification codes (OTP)",
    ],
  },
  {
    name: "Insurance Companies",
    regulation: "State insurance department regulations, NAIC guidelines",
    prohibited: [
      "Policy solicitations to cold leads",
      "Premium rate promotions (e.g., 'Switch and save 20%')",
      "Coverage upsell messages",
      "Open enrollment campaign blasts",
      "Cross-sell messages for additional products",
    ],
    allowed: [
      "Policy renewal reminders for specific expiring policies",
      "Payment due date reminders",
      "Claim status updates and filing confirmations",
      "Adjuster appointment confirmations",
      "Coverage change confirmations initiated by the policyholder",
    ],
  },
  {
    name: "Investment Advisors & Securities Firms",
    regulation: "SEC, FINRA, Investment Advisers Act",
    prohibited: [
      "Investment product solicitations",
      "Stock or fund recommendations",
      "Portfolio performance teasers",
      "Sales-oriented seminar invitations",
      "Cold outreach to prospect lists",
      "Any message that could be construed as investment advice",
    ],
    allowed: [
      "Trade confirmation notifications for existing clients",
      "Account statement availability alerts",
      "Meeting and review appointment confirmations",
      "Required regulatory disclosures triggered by account activity",
      "Authentication and security verification codes",
    ],
  },
  {
    name: "Healthcare Providers",
    regulation: "HIPAA, HITECH Act",
    prohibited: [
      "New patient solicitation campaigns",
      "Promotional messaging for elective procedures",
      "Wellness product upsell messages",
      "Health screening event promotions to general lists",
      "Any message marketing services to patients who haven't inquired",
    ],
    allowed: [
      "Appointment reminders and confirmations",
      "Prescription ready notifications",
      "Lab result availability alerts (no PHI in message body)",
      "Post-appointment follow-up care instructions",
      "Billing statements and payment reminders",
    ],
    note: "All messages must be HIPAA-compliant. PHI must never appear in SMS message bodies.",
  },
  {
    name: "Debt Consolidation",
    regulation: "FTC regulations on debt relief services",
    prohibited: [
      "Cold outreach campaigns",
      "Savings-based promotional messaging",
      "Urgency-based solicitations to purchased leads",
    ],
    allowed: [
      "Program enrollment confirmations for active clients",
      "Payment schedule notifications for enrolled clients",
      "Account status updates for clients with active plans",
    ],
    note: "Heavily scrutinized. Requires strong opt-in documentation. Frequently rejected without exceptional consent records.",
  },
  {
    name: "Credit Repair Services",
    regulation: "Credit Repair Organizations Act (CROA), FTC rules",
    prohibited: [
      "Solicitation campaigns (e.g., 'We can remove negative items')",
      "Before-and-after score promotional messaging",
      "Urgency-based outreach",
      "Cold lead nurture sequences",
    ],
    allowed: [
      "Dispute status updates for clients with active engagements",
      "Document request notifications for open files",
      "Progress updates tied to an active service agreement",
    ],
    note: "Frequently rejected by carriers even for transactional campaigns. Requires exceptional documentation of explicit written consent and active client relationships.",
  },
  {
    name: "Law Firms & Legal Services",
    regulation: "State Bar Model Rules of Professional Conduct (Rule 7.3)",
    prohibited: [
      "Solicitation of new clients via SMS",
      "Accident or injury campaign messages",
      "Mass outreach to purchased leads",
      "Settlement advertising",
    ],
    allowed: [
      "Case status updates for existing clients",
      "Court date reminders for active clients",
      "Document request notifications for open matters",
      "Appointment confirmations for client-initiated consultations",
      "Billing reminders for existing clients",
    ],
    note: "SMS solicitation of prospective clients is prohibited in virtually all U.S. jurisdictions under state bar advertising rules, layered on top of carrier restrictions.",
  },
  {
    name: "Political Campaigns",
    regulation: "FEC regulations, carrier political use case requirements",
    prohibited: [
      "Broadcast promotional political messaging via A2P 10DLC without special-use registration",
      "Mass unsolicited campaign blasts",
      "P2P political texting via A2P platforms without P2P registration",
    ],
    allowed: [
      "Volunteer shift confirmations",
      "Event logistics for confirmed attendees",
      "Donation receipt confirmations",
      "RSVP confirmations for registered attendees",
    ],
    note: "Political campaigns must register under a dedicated Political use case with additional carrier vetting. P2P and A2P operate under different rules.",
  },
];

export default function EligibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-bold" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            GetA2PApproved
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/#problem" className="text-slate-500 hover:text-slate-900 transition-colors">Why Us</Link>
            <Link href="/#how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors">How It Works</Link>
            <Link href="/#pricing" className="text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/eligibility" className="text-teal-600 font-medium">Eligibility</Link>
            <Link href="/sign-up" className="gradient-bg rounded-lg px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity shadow-sm text-sm" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)" }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Page header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
            Before You Register
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            A2P 10DLC Industry Eligibility
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Not every business can register for A2P 10DLC. Carriers and the CTIA block certain industries entirely, and restrict others to transactional messages only. Check your industry below before purchasing.
          </p>
        </div>

        {/* Summary boxes */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="font-semibold text-emerald-800">Standard</span>
            </div>
            <p className="text-sm text-emerald-700">Your industry is not regulated. You can send both marketing and transactional SMS messages with proper consent.</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span className="font-semibold text-amber-800">Restricted</span>
            </div>
            <p className="text-sm text-amber-700">You can register, but only for transactional messages. Promotional and marketing SMS is not permitted. We generate transactional-only compliant documents.</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="font-semibold text-red-800">Prohibited</span>
            </div>
            <p className="text-sm text-red-700">Your industry is blocked from A2P 10DLC registration entirely. Carriers will reject your application regardless of message type or consent.</p>
          </div>
        </div>

        {/* Universal rule callout */}
        <div className="mb-14 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Universal Rules for All Industries</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
            {[
              "Every message must identify your business by name",
              "Every message must include STOP opt-out language",
              'Every message must include "Msg & data rates may apply"',
              "Opt-in consent must be express, written, and unchecked by default",
              "SMS opt-in data cannot be shared or transferred to any third party",
              "Transactional messages must be triggered by a user action — not broadcast on a schedule",
              "Any message with a promotional call to action, discount, or rate quote is considered promotional",
              "Messages to contacts who did not affirmatively opt in are prohibited",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Fully Prohibited */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fully Prohibited Industries</h2>
              <p className="text-sm text-slate-500">Cannot register for A2P 10DLC at all — blocked regardless of message type or consent</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {prohibitedIndustries.map((industry) => (
              <div key={industry.name} className="rounded-xl border border-red-200 bg-red-50/50 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <h3 className="font-semibold text-red-900">{industry.name}</h3>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">{industry.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Restricted */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Restricted Industries — Transactional Only</h2>
              <p className="text-sm text-slate-500">Can register for A2P 10DLC, but limited to transactional messages. No promotional or marketing SMS.</p>
            </div>
          </div>

          <div className="space-y-4">
            {restrictedIndustries.map((industry) => (
              <details key={industry.name} className="group rounded-xl border border-amber-200 bg-amber-50/30 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-slate-900">{industry.name}</span>
                      <span className="ml-3 text-xs text-slate-400">{industry.regulation}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 border-t border-amber-100">
                  {industry.note && (
                    <div className="mt-4 mb-4 flex items-start gap-2 bg-amber-100 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {industry.note}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">Not Permitted</h4>
                      <ul className="space-y-1.5">
                        {industry.prohibited.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                            <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Permitted (Transactional)</h4>
                      <ul className="space-y-1.5">
                        {industry.allowed.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-10 text-center" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)" }}>
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto text-sm">
            If your industry is eligible, we&apos;ll generate fully compliant documents tailored to your registration requirements — including transactional-only language if your industry requires it.
          </p>
          <Link
            href="/#pricing"
            className="inline-block bg-white text-teal-700 font-semibold rounded-lg px-8 py-3 hover:bg-teal-50 transition-colors shadow-md text-sm"
          >
            View Pricing
          </Link>
          <p className="mt-4 text-xs text-teal-200">
            Not sure if you qualify? The questionnaire will flag any industry restrictions before you generate.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-xs text-slate-400 text-center leading-relaxed max-w-3xl mx-auto">
          This page is for informational purposes only and does not constitute legal advice. Industry eligibility rules for A2P 10DLC are set by carriers and the CTIA and are subject to change. We recommend consulting a licensed attorney before submitting your A2P registration. GetA2PApproved does not guarantee registration approval.
        </p>
      </main>

      {/* Footer */}
      <footer className="mt-10 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            GetA2PApproved
          </Link>
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} GetA2PApproved. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <Link href="/#pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/eligibility" className="hover:text-slate-600 transition-colors">Eligibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
