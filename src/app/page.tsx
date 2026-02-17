const APP_URL = "https://go.geta2papproved.com";

const pricingTiers = [
  {
    name: "Single Credit",
    price: "$47",
    period: "one-time",
    description: "1 A2P Project",
    plan: "single_credit",
    features: [
      "1 complete A2P project",
      "Privacy policy + terms & conditions",
      "Update existing docs or generate new",
      "Copy-paste application answers",
      "Consent box language guidance",
    ],
    cta: "Buy Now",
    highlighted: false,
  },
  {
    name: "Monthly Pro",
    price: "$97",
    period: "/month",
    description: "Up to 15 projects/month",
    plan: "monthly_pro",
    features: [
      "Up to 15 projects per month",
      "Privacy policy + terms & conditions",
      "Update existing docs or generate new",
      "Copy-paste application answers",
      "Consent box language guidance",
      "Shareable client intake links",
    ],
    cta: "Subscribe Now",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Annual Unlimited",
    price: "$497",
    period: "/year",
    description: "Up to 150 projects/year",
    plan: "annual_unlimited",
    features: [
      "Up to 150 projects per year",
      "Privacy policy + terms & conditions",
      "Update existing docs or generate new",
      "Copy-paste application answers",
      "Consent box language guidance",
      "Shareable client intake links",
      "Save 57% vs monthly",
    ],
    cta: "Subscribe & Save",
    highlighted: false,
  },
];

const painPoints = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "Messages Getting Filtered?",
    description: "Carriers are silently blocking unregistered SMS traffic. Your customers never see your messages and you have no idea why delivery rates are tanking.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: "Campaign Rejected Again?",
    description: "You submitted your A2P registration and got rejected with vague feedback like \"non-compliant privacy policy\" — but no one tells you exactly what's wrong or what to fix.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Hours Lost to Legal Research?",
    description: "You're Googling TCPA requirements, reading CTIA guidelines, and trying to piece together what language carriers actually want. It takes hours and you're still not sure you got it right.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
      </svg>
    ),
    title: "Confused by the Application?",
    description: "The A2P registration form asks for use case descriptions, sample messages, and campaign details in a specific format. One wrong answer and your application gets flagged for manual review.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: "Consent Boxes Are Wrong?",
    description: "Your website forms have the wrong consent language, pre-checked boxes, or are missing the separate marketing vs. transactional opt-ins that carriers require. And you didn't even know it was an issue.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: "Stuck in a Rejection Loop?",
    description: "You fix one thing, resubmit, and get rejected for something else. Each round takes days or weeks of waiting. Meanwhile your SMS campaigns are completely dead in the water.",
  },
];

const steps = [
  {
    number: "01",
    title: "Answer the Questionnaire",
    description: "Tell us about your business, SMS use cases, and messaging campaigns. Already have a privacy policy or terms? Paste them in and we'll update them with the right A2P language instead of starting from scratch.",
  },
  {
    number: "02",
    title: "Get Your Compliance Package",
    description: "We generate carrier-compliant privacy policies and terms & conditions with all required TCPA, CTIA, and A2P disclosures. Plus, you get ready-to-paste answers for your official A2P registration application and exact consent box language for your forms.",
  },
  {
    number: "03",
    title: "Publish & Submit",
    description: "Drop the generated documents on your website, update your form consent checkboxes with the language we provide, and submit your A2P 10DLC registration. Everything reviewers look for is already included.",
  },
];

const features = [
  {
    title: "TCPA & CTIA Compliant",
    description: "Every document includes required disclosures for TCPA, CTIA, and carrier-specific requirements.",
  },
  {
    title: "SMS Consent Language",
    description: "Proper opt-in, opt-out (STOP), and HELP response disclosures that carriers require for approval.",
  },
  {
    title: "Update Existing Documents",
    description: "Already have a privacy policy and terms? Paste them in and we'll add the missing A2P compliance language instead of starting over.",
  },
  {
    title: "Application-Ready Answers",
    description: "Get copy-paste entries for your A2P registration application — use case descriptions, sample messages, and campaign details formatted exactly how carriers want them.",
  },
  {
    title: "Consent Box Guidance",
    description: "We tell you exactly what language needs to go on your opt-in forms and consent checkboxes to be compliant with carrier requirements.",
  },
  {
    title: "Tailored to Your Business",
    description: "Documents are generated based on your specific business info, SMS campaigns, and messaging frequency.",
  },
  {
    title: "Client Intake Links",
    description: "Agencies: send questionnaires directly to your clients. They fill in their info, you generate the documents.",
  },
  {
    title: "Multiple Campaign Types",
    description: "Covers both marketing and transactional SMS campaigns with proper dual-consent disclosures.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="text-xl font-bold gradient-text tracking-tight">
            GetA2PApproved
          </span>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#problem" className="text-slate-500 hover:text-slate-900 transition-colors">
              Why Us
            </a>
            <a href="#how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-500 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a
              href={`${APP_URL}/sign-in`}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Sign In
            </a>
            <a
              href={`${APP_URL}/sign-up`}
              className="gradient-bg rounded-lg px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative px-6 py-20 sm:py-28 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-teal-200 rounded-full px-4 py-1.5 text-sm text-teal-700 font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            A2P compliance preparation tool for SMS marketers & agencies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
            Stop Getting Your A2P
            <br />
            Campaigns{" "}
            <span className="gradient-text">Rejected</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Generate or update your privacy policy and terms & conditions with
            the exact compliance language carriers look for. Get copy-paste
            application answers and consent box language — everything you need
            to submit your A2P 10DLC registration with confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${APP_URL}/sign-up`}
              className="gradient-bg rounded-lg px-8 py-3.5 text-white font-semibold hover:opacity-90 transition-opacity shadow-md hover:shadow-lg text-base"
            >
              Generate Your Documents Now
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            >
              See how it works
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            No subscription required. Start with a single project for $47. Already have documents? We{"'"}ll update them.
          </p>
        </div>
      </section>

      {/* Problem / Pain Points */}
      <section id="problem" className="px-6 py-20 bg-slate-50">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            A2P Registration Is a Compliance Nightmare
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Carriers reject campaigns every day for missing compliance language. Here{"'"}s what businesses like yours are dealing with.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-teal-200 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg gradient-bg-subtle flex items-center justify-center text-teal-600 mb-4">
                {point.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{point.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Why It Matters — nested under The Problem */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Privacy Policy & Terms Are the #1 Reason Campaigns Get Rejected
            </h3>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              Carriers don{"'"}t just check that you have these documents — they verify that specific A2P compliance language is present. Missing even one required disclosure means rejection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <h3 className="font-semibold text-red-800">What Gets You Rejected</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Privacy policy with no SMS/messaging section at all
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Missing opt-out language (reply STOP to cancel)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  No &quot;message and data rates may apply&quot; disclosure
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Pre-checked consent boxes on your forms
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  No statement that consent is not shared with third parties
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Vague or missing message frequency disclosure
                </li>
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <h3 className="font-semibold text-emerald-800">What We Generate For You</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Dedicated SMS/text messaging section with full disclosures
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Complete opt-in, opt-out (STOP), and HELP language
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Message frequency and data rates disclosures
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Exact consent checkbox language for your forms
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  Third-party data sharing statements
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0">&#8226;</span>
                  TCPA, CTIA, and carrier-specific compliance language
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
            What You Get
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            A Complete A2P Compliance Package
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Not just documents — we give you everything you need to fill out your A2P registration application and update your website and forms.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Privacy Policy</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Complete privacy policy with dedicated SMS/messaging section, consent language, and all required A2P disclosures.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Terms & Conditions</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Full terms of service with SMS program terms, dual-consent disclosures, and TCPA-compliant language.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Application Answers</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Copy-paste entries for your official A2P registration — use case descriptions, sample messages, and campaign details.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Form & Consent Guidance</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Exact language for your opt-in consent checkboxes and form disclosures so your website passes carrier review.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Three Steps to Compliance
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              From questionnaire to a complete compliance package in minutes, not days.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black text-teal-100 mb-4 select-none">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={`${APP_URL}/sign-up`}
              className="gradient-bg inline-block rounded-lg px-8 py-3.5 text-white font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Everything Carriers Look For
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Our generated documents include every compliance requirement that carriers check during A2P 10DLC review.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-xl border border-slate-200 bg-white">
              <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center mb-4">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold gradient-text">100%</p>
            <p className="text-sm text-slate-500 mt-1">Compliant Documents</p>
          </div>
          <div>
            <p className="text-4xl font-bold gradient-text">&lt;5 min</p>
            <p className="text-sm text-slate-500 mt-1">From Start to Finish</p>
          </div>
          <div>
            <p className="text-4xl font-bold gradient-text">TCPA + CTIA</p>
            <p className="text-sm text-slate-500 mt-1">Full Regulatory Coverage</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Every project includes a full compliance package — privacy policy, terms & conditions, application answers, and consent box language.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.plan}
              className={`relative rounded-xl border p-8 flex flex-col bg-white transition-all duration-200 hover:shadow-lg ${
                tier.highlighted
                  ? "border-teal-400 ring-2 ring-teal-400 shadow-md"
                  : "border-slate-200 hover:border-teal-200"
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {tier.badge}
                </span>
              )}
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  {tier.name}
                </p>
                <p className="mt-3">
                  <span className="text-5xl font-bold text-slate-900">{tier.price}</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">{tier.period}</p>
                <p className="mt-2 text-sm text-slate-500">{tier.description}</p>
              </div>
              <ul className="space-y-3 text-sm flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`${APP_URL}/sign-up`}
                className={`block text-center rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
                  tier.highlighted
                    ? "gradient-bg text-white hover:opacity-90 shadow-md"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is A2P 10DLC and why do I need it?",
                a: "A2P 10DLC (Application-to-Person 10-Digit Long Code) is a carrier-mandated registration system for businesses sending SMS messages. Without registration, your messages get filtered or blocked entirely.",
              },
              {
                q: "What exactly do I get with each project?",
                a: "Each project gives you a full compliance package: a carrier-compliant privacy policy, terms & conditions, copy-paste answers for your A2P registration application, and exact consent checkbox language for your opt-in forms. Everything you need to submit your registration and update your website.",
              },
              {
                q: "I already have a privacy policy and terms. Can you just update them?",
                a: "Yes — you can paste your existing privacy policy and terms & conditions into the questionnaire. We'll keep your current language and add the missing A2P compliance sections instead of generating everything from scratch.",
              },
              {
                q: "Do you submit the A2P registration for me?",
                a: "No. GetA2PApproved is a self-service compliance preparation tool. We generate the documents, application answers, and consent language you need, but you submit the actual A2P 10DLC registration through your SMS platform (GoHighLevel, Twilio, etc.) yourself. We are not a registration service and do not guarantee approvals.",
              },
              {
                q: "Do I still need a lawyer?",
                a: "Our documents are designed to include the compliance language carriers look for during A2P review. However, we are not a law firm and this is not legal advice. We recommend having a legal professional review your final documents. Our tool helps you get the compliance language right so you can focus on getting approved.",
              },
              {
                q: "What SMS platforms do you support?",
                a: "Our documents work with any SMS platform — GoHighLevel, Twilio, Vonage, Bandwidth, Plivo, or any other provider that requires A2P 10DLC registration.",
              },
              {
                q: "What if my campaign gets rejected?",
                a: "You can regenerate your documents at any time within your project. Update your questionnaire answers and generate updated documents to address any feedback from the carrier review.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-teal-200 transition-colors">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-semibold text-slate-900 pr-8">
                    {faq.q}
                  </h3>
                  <svg
                    className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 -mt-1">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto rounded-2xl gradient-bg p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Your Campaign Approved?
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              Stop losing time on compliance paperwork. Get your complete A2P
              compliance package — documents, application answers, and consent
              language — in minutes.
            </p>
            <a
              href={`${APP_URL}/sign-up`}
              className="inline-block bg-white text-teal-700 font-semibold rounded-lg px-8 py-3.5 hover:bg-teal-50 transition-colors shadow-lg"
            >
              Get Started for $47
            </a>
            <p className="mt-4 text-sm text-teal-200">
              No subscription required. One credit = one complete project.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer + Footer */}
      <footer className="px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto py-6">
          <p className="text-xs text-slate-400 text-center max-w-3xl mx-auto mb-6 leading-relaxed">
            GetA2PApproved is a self-service compliance preparation tool. We are not a law firm, do not provide legal advice, and do not submit A2P registrations on your behalf. Our generated documents are designed to include the compliance language that carriers typically look for during A2P 10DLC review. We do not guarantee campaign approvals. We recommend consulting a licensed attorney for final review of all legal documents. Use of our generated documents is at your own discretion and risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-semibold gradient-text">GetA2PApproved</span>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} GetA2PApproved. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href={`${APP_URL}/sign-in`} className="hover:text-slate-600 transition-colors">Sign In</a>
              <a href="#pricing" className="hover:text-slate-600 transition-colors">Pricing</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
