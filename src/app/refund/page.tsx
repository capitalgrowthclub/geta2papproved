import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

export const metadata = {
  title: "Refund Policy | GetA2PApproved",
  description:
    "GetA2PApproved refund policy. Learn about our satisfaction guarantee and refund process for A2P 10DLC compliance document packages.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-bold gradient-text tracking-tight">
            GetA2PApproved
          </Link>
          <Link
            href="/#pricing"
            className="gradient-bg rounded-lg px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund Policy</h1>

        <div className="text-sm text-slate-600 mb-10 space-y-1">
          <p><strong>Business Name:</strong> GetA2PApproved LLC</p>
          <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
          <p><strong>Effective Date:</strong> February 24, 2026</p>
          <p><strong>Last Updated:</strong> February 24, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Overview</h2>
            <p className="mb-4">
              This Refund Policy governs all purchases made through GetA2PApproved LLC (&ldquo;GetA2PApproved LLC,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) at https://www.geta2papproved.com/. By purchasing any product or service from GetA2PApproved LLC, you acknowledge that you have read, understood, and agree to be bound by the terms of this Refund Policy. This Refund Policy is incorporated by reference into our Terms &amp; Conditions and applies to all transactions processed through our platform.
            </p>
            <p>
              GetA2PApproved LLC is committed to delivering high-quality compliance documentation to every customer. We stand behind the services we provide and have established this policy to ensure that our customers are treated fairly while protecting the integrity of our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. What We Guarantee</h2>
            <p className="mb-4">
              GetA2PApproved LLC guarantees the delivery of the following compliance documents for every completed project purchased through our platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>A customized, A2P 10DLC-compliant <strong>Privacy Policy</strong> tailored to your specific business and SMS use case;</li>
              <li>Customized <strong>Terms &amp; Conditions</strong> containing all required A2P 10DLC compliance disclosures; and</li>
              <li><strong>A2P Submission Language</strong> — copy-paste ready answers for your A2P 10DLC registration application, including use case descriptions, sample message copy, and campaign detail responses.</li>
            </ul>
            <p>
              Our guarantee is limited to the successful generation and delivery of these documents based on the information you provide. We do not guarantee any outcome beyond document delivery, including but not limited to the approval of your A2P 10DLC campaign registration.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. No Guarantee of A2P Campaign Approval</h2>
            <p className="mb-4">
              GetA2PApproved LLC expressly does not guarantee that any document, submission language, or compliance package generated through our platform will result in the approval of your A2P 10DLC campaign registration. A2P 10DLC campaign registration decisions are made exclusively by The Campaign Registry, individual wireless carriers, and their associated review teams using their own proprietary criteria, which are subject to change at any time without notice.
            </p>
            <p className="mb-4">
              GetA2PApproved LLC has no control over, and accepts no responsibility for, the registration decisions made by The Campaign Registry, any wireless carrier, or any other third-party reviewing authority. The outcome of your A2P 10DLC registration is determined entirely by those third parties and is outside the scope of our service.
            </p>
            <p className="font-medium text-slate-800">
              A failed, rejected, or unapproved A2P 10DLC campaign registration does not constitute grounds for a refund under this policy. If your campaign is rejected after using our generated documents, you are not entitled to a refund solely on the basis of that rejection.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. When You Are Entitled to a Refund</h2>
            <p className="mb-4">
              You are entitled to request a full refund in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li>
                <strong>Failure to Deliver Documents:</strong> If GetA2PApproved LLC fails to generate and deliver your Privacy Policy, Terms &amp; Conditions, and A2P Submission Language due to a technical error, platform failure, or other issue on our end, you are entitled to a full refund of the amount paid for that project.
              </li>
              <li>
                <strong>Platform or System Errors:</strong> If a technical error during checkout, document generation, or delivery prevents you from receiving the services you paid for, you are entitled to a full refund upon our investigation and confirmation of the error.
              </li>
            </ul>
            <p>
              All refund requests are subject to investigation by our support team. GetA2PApproved LLC reserves the right to first attempt to resolve any technical issue by delivering the requested documents before issuing a monetary refund. If we are able to successfully deliver your documents following investigation, your refund request may be denied.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Auto-Renewal Refunds</h2>
            <p className="mb-4">
              For customers on a recurring subscription plan (Monthly Pro or Annual Unlimited), GetA2PApproved LLC provides a <strong>7-day grace period</strong> following each automatic renewal charge during which you may contact us to dispute the renewal and request a full refund of that billing cycle&apos;s charge.
            </p>
            <p className="mb-4">
              To qualify for an auto-renewal refund, you must contact us within 7 calendar days of the renewal charge date using the process described in Section 6 of this policy.
            </p>
            <p className="font-medium text-slate-800">
              Important: If our records show that any project was created or any documents were generated on your account during the 7-day period following the renewal charge, you will not be entitled to a refund for that renewal period. The creation of a project constitutes use of the services covered by that billing cycle, and refunds will not be issued once services have been utilized.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund under this policy, please contact GetA2PApproved LLC using the following process:
            </p>
            <ol className="list-decimal pl-6 space-y-3 mb-4">
              <li>
                Send an email to <strong>support@geta2papproved.com</strong> with the subject line: <strong>REFUND</strong>.
              </li>
              <li>
                In the body of your email, include your full name, the email address associated with your account, the date of the charge you are disputing, the amount of the charge, and a clear description of the reason for your refund request.
              </li>
              <li>
                Allow our support team a reasonable amount of time to investigate your account and the circumstances of your request. We will review your account activity, transaction history, and any technical logs relevant to your case before issuing a determination.
              </li>
              <li>
                You will receive a written response to your refund request at the email address on file for your account.
              </li>
            </ol>
            <p>
              Refund requests that do not use the required subject line or do not include sufficient account information may experience delays in processing. GetA2PApproved LLC is not responsible for delays caused by incomplete refund submissions.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Form of Refund</h2>
            <p className="mb-4">
              Approved refunds may be issued in one of the following forms, at the sole discretion of GetA2PApproved LLC:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Monetary Refund:</strong> A refund to the original payment method used at the time of purchase, processed within the timeframe required by the applicable payment processor (typically 5–10 business days).
              </li>
              <li>
                <strong>Account Credits:</strong> In lieu of a monetary refund, GetA2PApproved LLC may issue credits to your account equal to the value of the amount being refunded. Account credits may be applied toward future purchases or projects on our platform.
              </li>
            </ul>
            <p>
              You are not always entitled to a monetary refund. GetA2PApproved LLC reserves the right to resolve eligible refund requests through the issuance of account credits rather than a return of funds to your payment method. We will communicate the form of any approved refund to you in our written response to your request.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Non-Refundable Circumstances</h2>
            <p className="mb-3">Refunds will not be issued in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your A2P 10DLC campaign registration was rejected, denied, or not approved by The Campaign Registry, a wireless carrier, or any other reviewing authority;</li>
              <li>You are dissatisfied with the content of the generated documents but all three deliverables (Privacy Policy, Terms &amp; Conditions, and A2P Submission Language) were successfully delivered;</li>
              <li>You provided inaccurate, incomplete, or misleading business information that affected the quality or accuracy of your generated documents;</li>
              <li>You have already used the documents in connection with an A2P 10DLC registration submission or published them on your website;</li>
              <li>You request a refund for an auto-renewal charge after the 7-day grace period has expired;</li>
              <li>Your account shows project activity during the 7-day auto-renewal grace period;</li>
              <li>You change your mind about the purchase after documents have been generated and delivered; or</li>
              <li>You request a refund based on a change in carrier compliance requirements or A2P 10DLC standards that occurred after your documents were generated.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Acknowledgment and Agreement</h2>
            <p className="mb-4">
              By completing a purchase on the GetA2PApproved LLC platform, you acknowledge that you have read this Refund Policy in its entirety and that you agree to be bound by its terms. You understand and accept that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>GetA2PApproved LLC does not guarantee A2P 10DLC campaign approval, and a rejection or denial of your campaign registration is not grounds for a refund;</li>
              <li>Refunds are available only in the specific circumstances described in this policy;</li>
              <li>Refunds may be issued as account credits rather than monetary refunds at the discretion of GetA2PApproved LLC;</li>
              <li>All refund requests must be submitted via email to support@geta2papproved.com with the subject line REFUND and are subject to investigation; and</li>
              <li>Auto-renewal refunds are subject to the 7-day grace period and project activity conditions described in Section 5 of this policy.</li>
            </ul>
            <p>
              This Refund Policy is subject to change at any time. The most current version will always be available at https://www.geta2papproved.com/refund. Your continued use of our platform following any update to this policy constitutes your acceptance of the revised terms.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Refund Policy or would like to submit a refund request, please contact us using the information below:
            </p>
            <div className="space-y-1">
              <p><strong>Legal Business Name:</strong> GetA2PApproved LLC</p>
              <p><strong>Mailing Address:</strong> 1124 Dunn Ave, Cheyenne, WY 82001</p>
              <p><strong>Email:</strong> support@geta2papproved.com (subject line: REFUND)</p>
              <p><strong>Phone:</strong> +1 561-593-3173</p>
              <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
            </div>
          </section>

        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
