export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">
          GetA2PApproved
        </span>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white">
            Pricing
          </a>
          <a
            href="#cta"
            className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Get Your A2P 10DLC Campaign{" "}
          <span className="text-blue-600">Approved Fast</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Stop worrying about carrier rejections. We guide you through the
          entire A2P registration process so your business SMS messages actually
          get delivered.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#cta"
            className="rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Start Your Application
          </a>
          <a
            href="#how-it-works"
            className="rounded-full border border-zinc-300 px-8 py-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Submit Your Info",
                desc: "Tell us about your business and how you use SMS. We'll identify the right campaign type for you.",
              },
              {
                step: "2",
                title: "We Handle Registration",
                desc: "Our experts prepare and submit your A2P 10DLC registration with carrier-approved messaging.",
              },
              {
                step: "3",
                title: "Get Approved & Send",
                desc: "Once approved, your messages get priority delivery with higher throughput and lower filtering.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          No hidden fees. Pay once, get approved.
        </p>
        <div className="mx-auto max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
            Full Service
          </p>
          <p className="mt-4 text-5xl font-bold">$299</p>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">one-time</p>
          <ul className="mt-8 space-y-3 text-left text-sm">
            {[
              "Brand & campaign registration",
              "Carrier-optimized use case description",
              "Sample message review",
              "Rejection appeal handling",
              "Priority email support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            className="mt-8 block rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 py-20 bg-zinc-50 dark:bg-zinc-900 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Your A2P Campaign Approved?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Join hundreds of businesses that trust us to handle their 10DLC
            registration. Stop getting filtered — start getting delivered.
          </p>
          <a
            href="mailto:hello@geta2papproved.com"
            className="inline-block rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Contact Us to Get Started
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} GetA2PApproved. All rights reserved.</p>
      </footer>
    </div>
  );
}
