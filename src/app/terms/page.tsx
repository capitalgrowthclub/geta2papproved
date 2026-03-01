import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

export const metadata = {
  title: "Terms & Conditions | GetA2PApproved",
  description:
    "Terms and conditions for using GetA2PApproved. Understand your rights and obligations when using our A2P 10DLC compliance document generation platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms &amp; Conditions</h1>

        <div className="text-sm text-slate-600 mb-10 space-y-1">
          <p><strong>Business Name:</strong> GetA2PApproved LLC</p>
          <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
          <p><strong>Effective Date:</strong> February 24, 2026</p>
          <p><strong>Last Updated:</strong> February 24, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              These Terms &amp; Conditions (the &ldquo;Terms,&rdquo; &ldquo;Agreement,&rdquo; or &ldquo;Terms &amp; Conditions&rdquo;) constitute a legally binding agreement between you (&ldquo;you,&rdquo; &ldquo;your,&rdquo; or &ldquo;User&rdquo;) and GetA2PApproved LLC, a Wyoming limited liability company (&ldquo;GetA2PApproved LLC,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use of the website located at https://www.geta2papproved.com/ (the &ldquo;Site&rdquo;) and all services, features, content, tools, and products made available through the Site (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p className="mb-4">
              By accessing or using our Site, creating an account, completing any form on our platform, submitting payment for any product or service, downloading or using any generated document, or otherwise interacting with our Services in any way, you acknowledge that you have read, understood, and agree to be legally bound by these Terms &amp; Conditions and our Privacy Policy, which is incorporated herein by reference in its entirety. If you do not agree to these Terms &amp; Conditions, you must immediately cease all use of our Site and Services.
            </p>
            <p className="mb-4">
              Your continued use of the Site or Services following any modification to these Terms &amp; Conditions constitutes your acceptance of the modified terms. It is your responsibility to review these Terms &amp; Conditions periodically to remain informed of any updates. The &ldquo;Last Updated&rdquo; date at the top of this document reflects the most recent revision.
            </p>
            <p>
              These Terms &amp; Conditions apply to all visitors, registered users, paying customers, trial users, and any other individuals or entities who access or use the Site or Services, regardless of whether they have created an account or made a purchase. If you are accessing or using the Site or Services on behalf of a business entity, organization, or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms &amp; Conditions, and &ldquo;you&rdquo; as used herein shall refer to both you individually and that entity.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Services</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.1 Overview of GetA2PApproved LLC</h3>
            <p className="mb-4">
              GetA2PApproved LLC is a Wyoming limited liability company headquartered at 1124 Dunn Ave, Cheyenne, WY 82001. We operate an AI-powered compliance document generation service that helps businesses, marketing agencies, and independent professionals prepare the legal and compliance documentation required for A2P 10DLC SMS campaign registration with wireless carriers and The Campaign Registry (TCR). Our platform automates the generation of Privacy Policies, Terms &amp; Conditions, consent checkbox language, and application answers that are specifically designed to meet the compliance standards reviewed during A2P 10DLC campaign registration.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.2 Services Provided</h3>
            <p className="mb-3">Through our platform, GetA2PApproved LLC provides the following services to customers who purchase a project through our Site:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Generation of a customized, A2P 10DLC-compliant Privacy Policy tailored to the customer&apos;s specific business, SMS use case, messaging frequency, and opt-in/opt-out procedures;</li>
              <li>Generation of customized Terms &amp; Conditions containing all required A2P 10DLC compliance disclosures specific to the customer&apos;s SMS messaging program;</li>
              <li>Generation of consent checkbox language for use on the customer&apos;s opt-in forms, including separate marketing and service text message consent disclosures formatted in accordance with CTIA guidelines and carrier requirements;</li>
              <li>Generation of A2P 10DLC registration application answers, including use case descriptions, sample message copy, and campaign detail responses formatted for submission to The Campaign Registry and associated downstream carrier review;</li>
              <li>Educational content related to SMS compliance, TCPA requirements, CTIA guidelines, and A2P 10DLC campaign approval best practices; and</li>
              <li>Customer support via email to assist with questions about generated documents and the A2P registration process.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.3 SMS Messaging Program</h3>
            <p className="mb-4">
              In addition to the document generation services described in Section 2.2, GetA2PApproved LLC operates a text message communications program through which we send marketing text messages and service text messages to individuals who have affirmatively opted in to receive such communications. The terms governing our SMS messaging program are set forth in detail in Section 5 of these Terms &amp; Conditions. Our SMS messaging program is operated through GoHighLevel and delivered via Twilio&apos;s messaging infrastructure.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.4 Single-Project Pricing Model</h3>
            <p className="mb-4">
              GetA2PApproved LLC offers its compliance document generation services on a single-project, non-subscription basis, with individual projects available starting at forty-seven dollars ($47.00). No recurring subscription is required. Pricing for specific project types and any available packages is displayed on the pricing page of our Site. GetA2PApproved LLC reserves the right to modify its pricing at any time, provided that any pricing change will not affect projects that have already been purchased at the price in effect at the time of purchase.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.5 Nature of Documents Generated</h3>
            <p>
              The Privacy Policies, Terms &amp; Conditions, consent checkbox language, and application answers generated by our platform are produced using an AI-powered document generation engine based on the business-specific information you provide. The documents generated by GetA2PApproved LLC are designed to meet A2P 10DLC compliance standards and are intended to provide a strong foundation for your SMS campaign registration. However, GetA2PApproved LLC does not provide legal advice, and the documents generated through our platform do not constitute legal advice or create an attorney-client relationship between you and GetA2PApproved LLC or any of its personnel. We strongly recommend that you have any compliance documents reviewed by a qualified attorney licensed in your jurisdiction before using them in connection with any legal, regulatory, or contractual obligation beyond A2P 10DLC registration.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. User Eligibility</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.1 Age Requirement</h3>
            <p className="mb-4">
              You must be at least eighteen (18) years of age to access or use the Site or Services. By accessing or using our Site or Services, you represent and warrant that you are at least eighteen (18) years of age. If you are under the age of eighteen (18), you are not permitted to use the Site or Services under any circumstances, and you must immediately discontinue all access to and use of the Site and Services. GetA2PApproved LLC does not knowingly collect personal information from individuals under the age of eighteen (18). If we determine that a user is under the age of eighteen (18), we will terminate that user&apos;s account and delete any personal information associated with the account as promptly as reasonably practicable.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.2 Geographic Restriction</h3>
            <p className="mb-4">
              Our Services are intended exclusively for use by individuals, businesses, and entities located within the United States of America. A2P 10DLC campaign registration is a United States-specific regulatory framework administered by The Campaign Registry and applicable to text messaging conducted over United States wireless carrier networks. GetA2PApproved LLC makes no representation that the documents, guidance, or compliance language generated through our platform are appropriate for or compliant with the laws, regulations, or carrier requirements of any jurisdiction outside the United States. If you are accessing our Site or Services from outside the United States, you do so at your own risk and are solely responsible for ensuring compliance with applicable local laws.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.3 Business Use</h3>
            <p className="mb-4">
              Our Services are designed for use by businesses, marketing agencies, and adult professionals engaged in lawful commercial activities that involve or contemplate the use of A2P SMS messaging. By using our Services, you represent and warrant that you are using our platform in connection with a lawful business purpose, that the SMS campaigns for which you are generating compliance documentation comply with applicable law, and that you are authorized to submit A2P 10DLC registration applications on behalf of the business entity identified in your project submission.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.4 Account Registration</h3>
            <p>
              Certain features of our platform may require you to create an account. When registering for an account, you agree to provide accurate, current, and complete information and to update that information promptly if it changes. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately at support@geta2papproved.com if you suspect any unauthorized use of your account. GetA2PApproved LLC will not be liable for any loss or damage resulting from your failure to maintain the security of your account credentials.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Purchases, Payments, and Refunds</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">4.1 Purchase and Payment</h3>
            <p className="mb-4">
              When you purchase a project through GetA2PApproved LLC&apos;s platform, you agree to pay the purchase price displayed at the time of checkout. All prices are stated in United States dollars and are exclusive of any applicable taxes. You authorize GetA2PApproved LLC and its third-party payment processor to charge the payment method you provide at the time of purchase for the full amount of the transaction, including any applicable taxes. Payment is due in full at the time of purchase and is a prerequisite to the initiation of document generation services.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">4.2 Payment Processing</h3>
            <p className="mb-4">
              Payment processing services for GetA2PApproved LLC are provided by a third-party payment processor. GetA2PApproved LLC does not store complete payment card numbers on its servers. Your payment information is handled in accordance with the payment processor&apos;s own terms of service and privacy policy, which govern the security of your financial data. By submitting your payment information, you authorize the transaction and represent that you are the authorized holder of the payment method presented.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">4.3 Refund Policy</h3>
            <p className="mb-4">
              Because the Services provided by GetA2PApproved LLC involve the immediate generation of customized digital documents based on the specific information you provide, all sales are final unless otherwise expressly stated. Due to the digital and personalized nature of the documents generated, GetA2PApproved LLC does not offer refunds after document generation has commenced. If you experience a technical issue that prevents the generation or delivery of your documents, please contact us at support@geta2papproved.com and we will work to resolve the issue promptly. Any exceptions to this refund policy are made at the sole discretion of GetA2PApproved LLC.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">4.4 Document Delivery</h3>
            <p>
              Completed compliance documents are delivered electronically to the email address provided at checkout or through your account dashboard, as applicable. GetA2PApproved LLC is not responsible for delivery failures resulting from an incorrect email address provided by the user, spam or junk mail filters that redirect or block delivery emails, or technical issues with the user&apos;s own email provider. If you do not receive your completed documents within the expected delivery timeframe, please contact us at support@geta2papproved.com.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. SMS and Text Messaging Terms</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.1 Overview of Our Messaging Program</h3>
            <p className="mb-4">
              GetA2PApproved LLC operates a text message communications program through which we send two distinct categories of messages to individuals who have affirmatively opted in to receive them: (1) marketing text messages promoting our AI-powered A2P 10DLC compliance document generation service, and (2) service text messages triggered by specific customer actions on our platform. Both categories of messages are sent exclusively to individuals who have provided explicit, prior written consent through the designated opt-in mechanism described in Section 5.3 of these Terms &amp; Conditions. Our SMS messaging program is operated through GoHighLevel and delivered via Twilio&apos;s messaging infrastructure.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.2 Description of Message Types</h3>
            <p className="mb-3">
              <strong>Marketing Text Messages:</strong> GetA2PApproved LLC sends marketing text messages to prospects and existing customers who have explicitly opted in to receive marketing communications from us. These messages promote our AI-powered A2P 10DLC compliance document generation service and may include announcements about new features or platform updates, limited-time pricing offers and promotional discounts, reminders to complete your A2P registration documents, and educational tips related to SMS compliance and campaign approval. Marketing messages are sent at a frequency of up to 8 messages per month. The exact number of marketing messages you receive in any given calendar month may vary depending on your account activity and the campaigns active at the time, but will not exceed 8 messages per calendar month under any circumstances.
            </p>
            <p className="mb-4">
              <strong>Service Text Messages:</strong> GetA2PApproved LLC sends service text messages to customers to support their use of our platform following a purchase or sign-up. These messages are triggered directly by customer actions on our platform and may include order confirmations, payment receipts, delivery of access credentials or links to completed compliance documents, confirmation that a project submission has been received, and status updates regarding the progress of your A2P compliance document generation. Service text messages contain no promotional content whatsoever and are sent only when triggered by your individual account activity. The frequency of service text messages is not fixed and depends entirely on how frequently you take qualifying actions on our platform.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.3 How to Opt In — Consent Mechanism</h3>
            <p className="mb-4">
              Consent to receive text messages from GetA2PApproved LLC is obtained exclusively through an affirmative, unchecked opt-in checkbox presented at the point of data collection on our landing page form. The phone number field on our landing page form is required to use our Services; however, providing your phone number alone does not constitute consent to receive SMS text messages from GetA2PApproved LLC.
            </p>
            <p className="mb-4">
              Providing your phone number on our contact forms, registration pages, or intake forms does not, by itself, constitute consent to receive SMS text messages from GetA2PApproved LLC. Consent to receive text messages is obtained separately through an affirmative, unchecked checkbox specifically designated for SMS consent at the point of opt-in.
            </p>
            <p>
              Our landing page form presents two separate SMS consent checkboxes — one designated for marketing text messages and one designated for service text messages — so that users may provide granular, independent consent to each category of communication. Neither checkbox is pre-checked at any time. You must affirmatively and intentionally check each checkbox to consent to receiving that category of messages. Links to this Terms &amp; Conditions document and to our Privacy Policy are displayed in the footer of all forms containing SMS consent checkboxes so that you may review them before providing your consent.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.4 Consent Disclosures</h3>
            <p className="mb-3">The consent disclosures presented to users at the point of opt-in, as they appear directly adjacent to the corresponding SMS consent checkboxes on our landing page form, read as follows:</p>
            <p className="mb-2"><strong>Marketing Consent Disclosure:</strong></p>
            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-4">
              &ldquo;I agree to receive marketing texts from GetA2PApproved LLC (e.g. offers, new features, compliance tips). Up to 8 msgs/mo. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for info. Consent not required for purchase. SMS opt-in data is never shared with third parties.&rdquo;
            </blockquote>
            <p className="mb-2"><strong>Service Text Consent Disclosure:</strong></p>
            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-4">
              &ldquo;I agree to receive service texts from GetA2PApproved LLC (e.g. order confirmations, payment receipts, document delivery, project status updates). Msgs sent only when triggered by account activity. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for info. SMS opt-in data is never shared with third parties.&rdquo;
            </blockquote>
            <p className="mb-4">
              Both disclosures confirm the specific type of messages to be sent, the message frequency or triggering condition applicable to that message type, that message and data rates may apply, how to opt out by replying STOP, how to request help by replying HELP, and that SMS opt-in data is never shared with third parties.
            </p>
            <p>
              By affirmatively checking the marketing SMS consent checkbox on our landing page form, you agree to receive marketing text messages from GetA2PApproved LLC as described in these Terms &amp; Conditions. By affirmatively checking the service text SMS consent checkbox on our landing page form, you agree to receive service text messages from GetA2PApproved LLC as described in these Terms &amp; Conditions. Consent to receive either or both categories of text messages is not a condition of purchasing any product or service from GetA2PApproved LLC.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.5 Message Frequency</h3>
            <p>
              Marketing text messages are sent at a frequency of up to 8 messages per month. The exact number of marketing messages you receive in any calendar month will not exceed 8 messages and may be fewer depending on the campaigns active at the time and your account activity. Service text messages are sent only when triggered by your individual account activity on our platform, including actions such as completing a purchase, receiving a payment confirmation, having a document generation project completed, or receiving a status update on a pending submission. Because service messages are event-driven, the frequency of these messages depends entirely on how frequently you take qualifying actions on our platform, and there is no fixed number of service messages per month.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.6 Message and Data Rates</h3>
            <p>
              Message and data rates may apply to all text messages sent by GetA2PApproved LLC. The rates charged for receiving text messages from us are determined by your individual mobile wireless carrier and your specific rate plan. GetA2PApproved LLC does not charge any fee for sending text messages to you; however, your wireless carrier&apos;s standard messaging and data rates will apply to each message you receive. Please contact your wireless carrier directly if you are unsure whether your current plan includes unlimited text messaging or whether additional per-message charges may apply.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.7 Supported Wireless Carriers</h3>
            <p>
              GetA2PApproved LLC&apos;s text messaging program is compatible with the major United States wireless carriers, including but not limited to AT&amp;T, Verizon, T-Mobile, Boost Mobile, MetroPCS, and U.S. Cellular. Carrier support for long code and toll-free messaging may vary by carrier and network. GetA2PApproved LLC is not responsible for delayed or undelivered messages resulting from carrier filtering, network congestion, technical outages, or any other factors beyond our reasonable control.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.8 How to Opt Out</h3>
            <p className="mb-4">
              You may opt out of receiving text messages from GetA2PApproved LLC at any time by replying STOP to any text message you receive from us. Upon receipt of your STOP reply, GetA2PApproved LLC will process your opt-out request promptly and you will receive a single opt-out confirmation message acknowledging your request. The opt-out confirmation message will identify GetA2PApproved LLC by name and confirm that no further messages will be sent. No additional marketing or service text messages will be sent to your mobile number following receipt and processing of your STOP request, except as required by law or as necessary to deliver a single opt-out confirmation message.
            </p>
            <p className="mb-4">
              If you wish to re-enroll in our SMS messaging program after opting out, you may text START to +1 561-593-3173 or re-submit your SMS consent through the opt-in checkbox on our website contact form at https://www.geta2papproved.com/.
            </p>
            <p>
              Opting out of text messages does not affect your ability to purchase or access our services, log in to your account, or receive support via email. Your opt-out request removes only your mobile telephone number from our SMS messaging list and has no effect on any other aspect of your account or your access to our platform.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.9 How to Get Help</h3>
            <p className="mb-3">
              You may request help or information about our text messaging program at any time by replying HELP to any text message you receive from GetA2PApproved LLC. You will receive a response message containing our business name, a brief description of the messaging program, and instructions for opting out. You may also contact us directly for support related to our text messaging program using the following contact methods:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Email: support@geta2papproved.com</li>
              <li>Phone: +1 561-593-3173</li>
              <li>Mailing Address: GetA2PApproved LLC, 1124 Dunn Ave, Cheyenne, WY 82001</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.10 Explicit Prohibition on SMS Opt-In Data Sharing</h3>
            <p className="mb-4">
              GetA2PApproved LLC maintains an absolute and unconditional prohibition on the sharing of SMS opt-in data with any third party, under any circumstances, for any purpose whatsoever. SMS opt-in consent information — including but not limited to the mobile phone numbers collected through our opt-in forms, the date and time of consent, the consent language version presented at opt-in, the specific messaging program to which a user consented, and all related consent documentation — is never sold, rented, shared, transferred, disclosed, licensed, traded, or otherwise made available to any third party, affiliate, partner, subcontractor, data broker, list vendor, marketing network, or any other person or entity, for any purpose, under any circumstances.
            </p>
            <p className="mb-4">
              This prohibition applies regardless of whether any third party has entered into a confidentiality agreement with GetA2PApproved LLC, regardless of whether compensation is offered or received, and regardless of the stated purpose for which the third party seeks to use the data. Our subcontractors GoHighLevel and Twilio are engaged solely as data processors to facilitate the technical delivery of text messages on our behalf and are expressly prohibited from using SMS opt-in data for any purpose other than message delivery in accordance with our instructions. These subcontractors do not receive SMS opt-in data for their own marketing purposes, do not share such data with additional third parties, and are contractually bound to handle such data in compliance with applicable law.
            </p>
            <p>
              We do not purchase, rent, or acquire personal information from data brokers, list vendors, or any third-party lead generation sources for use in our SMS messaging program. All individuals enrolled in our SMS messaging program have consented directly and individually through our own opt-in forms. We do not participate in any affiliate-driven lead generation programs, co-registration arrangements, or shared opt-in networks in connection with our SMS messaging program.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.11 SMS Consent Records and Retention</h3>
            <p>
              GetA2PApproved LLC maintains records of all SMS opt-in consent events, including the mobile telephone number provided at opt-in, the date and time of consent, the version of the consent language presented to the user at the time of opt-in, and the specific messaging program to which consent was given. SMS consent records are retained in accordance with the retention periods set forth in our Privacy Policy, which is incorporated herein by reference. Specifically, SMS opt-in consent records are retained for a minimum of five (5) years from the date consent was obtained, and SMS opt-out records are retained permanently, consistent with the data retention provisions of our Privacy Policy. These retention periods are maintained to demonstrate compliance with the TCPA, CTIA guidelines, and A2P 10DLC carrier requirements in the event of an audit, dispute, regulatory inquiry, or litigation.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.12 TCPA and CTIA Compliance</h3>
            <p>
              GetA2PApproved LLC&apos;s SMS messaging program is designed and operated in compliance with the Telephone Consumer Protection Act (TCPA), 47 U.S.C. &sect; 227, and the regulations promulgated thereunder by the Federal Communications Commission (FCC), the guidelines published by the Cellular Telecommunications Industry Association (CTIA) for messaging programs, the requirements of The Campaign Registry (TCR) for A2P 10DLC campaign registration, and all applicable wireless carrier A2P 10DLC compliance standards. We obtain express written consent prior to sending any marketing text messages, honor all opt-out requests promptly, maintain complete and accurate consent records, and operate our messaging program through registered A2P 10DLC campaigns in accordance with carrier requirements.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Intellectual Property</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.1 Ownership of Platform and Content</h3>
            <p className="mb-4">
              The Site, platform, and all content, features, and functionality made available through our Services — including but not limited to the AI-powered document generation engine, all software, algorithms, code, design elements, graphics, user interface layouts, text content, educational materials, sample compliance language templates, and branding — are owned by GetA2PApproved LLC or its licensors and are protected by United States and international copyright, trademark, trade secret, patent, and other intellectual property laws. Nothing in these Terms &amp; Conditions transfers any intellectual property rights from GetA2PApproved LLC to you, except for the limited license described in Section 6.2 below.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.2 License to Use Generated Documents</h3>
            <p className="mb-4">
              Upon completion of your purchase and delivery of your generated compliance documents, GetA2PApproved LLC grants you a limited, non-exclusive, non-transferable, royalty-free license to use the documents generated for your specific project — including your Privacy Policy, Terms &amp; Conditions, consent checkbox language, and application answers — solely in connection with your own business&apos;s A2P 10DLC registration, website, and SMS messaging program. This license does not permit you to resell, sublicense, redistribute, reproduce, or otherwise transfer the generated documents to any third party for use in that third party&apos;s A2P 10DLC registration or any other purpose. You may publish the generated documents on your own website and submit them as part of your own A2P 10DLC registration application, which is the intended use of the documents.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.3 Restrictions on Platform Use</h3>
            <p className="mb-4">
              You may not copy, reproduce, modify, create derivative works from, distribute, publicly display, publicly perform, or otherwise exploit the Site, platform, underlying software, or any content from our Site (other than your own generated documents as permitted by Section 6.2) without the prior written consent of GetA2PApproved LLC. You may not reverse engineer, decompile, disassemble, or otherwise attempt to extract the source code of any portion of our platform or document generation engine. You may not frame, mirror, or scrape our Site or platform without our prior written authorization.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.4 User-Provided Content</h3>
            <p className="mb-4">
              When you submit business and campaign information to our platform for the purpose of generating compliance documents, you grant GetA2PApproved LLC a limited, non-exclusive license to use that information solely as necessary to generate your requested documents and provide the Services to you. GetA2PApproved LLC does not claim ownership of the business information you provide, and nothing in these Terms &amp; Conditions grants us any right to use your business information for any purpose other than generating your compliance documents and providing related customer support. GetA2PApproved LLC will not use your business-specific information for marketing purposes, resell your information to third parties, or disclose it except as described in our Privacy Policy.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.5 Trademarks</h3>
            <p>
              The name &ldquo;GetA2PApproved,&rdquo; the GetA2PApproved LLC logo, and any other trademarks, service marks, trade names, or product names displayed on our Site are the property of GetA2PApproved LLC and may not be used without our prior written consent. All other trademarks, service marks, and brand names referenced on our Site that are not owned by GetA2PApproved LLC are the property of their respective owners, and no endorsement, affiliation, or sponsorship is implied by their appearance on our Site.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Prohibited Conduct</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.1 General Prohibitions</h3>
            <p className="mb-4">
              By accessing or using our Site or Services, you agree that you will not engage in any of the following prohibited conduct. Violation of any of the prohibitions set forth in this Section 7 may result in immediate termination of your account and access to the Services, without refund, and may expose you to civil or criminal liability.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.2 Unlawful Use</h3>
            <p className="mb-4">
              You agree not to use our Site or Services for any unlawful purpose or in any manner that violates applicable federal, state, or local law. This includes but is not limited to using our platform to generate compliance documents for SMS campaigns that are themselves unlawful, fraudulent, deceptive, or in violation of the TCPA, CTIA guidelines, or A2P 10DLC carrier policies. You may not use our Services to facilitate the transmission of unsolicited commercial messages, spam, phishing communications, or any other form of unauthorized messaging.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.3 Misrepresentation</h3>
            <p className="mb-4">
              You agree not to provide false, inaccurate, misleading, or fraudulent business information when submitting your project to our platform. The documents generated by GetA2PApproved LLC are only as accurate as the information you provide. You are solely responsible for ensuring that the business information, use case descriptions, opt-in method descriptions, message frequency details, and all other data you submit accurately reflect your actual business practices. Submitting false information to generate compliance documents for use in an A2P 10DLC registration application may constitute fraud and may subject you to legal liability.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.4 Interference with the Platform</h3>
            <p className="mb-4">
              You agree not to interfere with or disrupt the operation of our Site, platform, or Services, or the servers or networks connected to them. You agree not to upload, transmit, or introduce any virus, worm, malware, trojan horse, spyware, ransomware, or other harmful code or program to our platform. You agree not to attempt to gain unauthorized access to any portion of our Site, platform, user accounts, or related systems or networks. You agree not to use any automated means — including bots, scrapers, crawlers, or scripts — to access, monitor, or copy any content from our Site without our prior written authorization.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.5 Violation of Third-Party Rights</h3>
            <p className="mb-4">
              You agree not to use our Services in a manner that infringes, misappropriates, or otherwise violates the intellectual property rights, privacy rights, publicity rights, or any other legal rights of any third party. You agree not to submit to our platform any business information, trade secrets, or confidential information belonging to a third party without authorization from that party.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.6 Prohibited SMS Practices</h3>
            <p className="mb-4">
              You agree that you will not use the compliance documents generated by GetA2PApproved LLC in connection with any SMS messaging program that: sends text messages to individuals who have not provided prior express consent; uses purchased, rented, or third-party acquired contact lists; employs pre-checked consent boxes or other deceptive opt-in mechanisms; sends messages at frequencies exceeding those disclosed at the point of opt-in; sends message content that materially differs from the use case described in your A2P 10DLC registration; or fails to honor opt-out requests submitted via the STOP keyword. Use of our generated documents in connection with any non-compliant SMS messaging program is prohibited and may constitute a violation of the TCPA and carrier policies for which you, not GetA2PApproved LLC, are solely responsible.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.7 Resale of Generated Documents</h3>
            <p>
              You agree not to resell, sublicense, redistribute, or otherwise transfer the compliance documents generated for your specific project to any third party for that party&apos;s own use in connection with A2P 10DLC registration, website publication, or SMS messaging compliance. The documents generated by GetA2PApproved LLC are licensed to you solely for use in connection with your own business and messaging program, as described in Section 6.2 of these Terms &amp; Conditions.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Disclaimers and Warranties</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.1 &ldquo;As Is&rdquo; Service</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              THE SITE AND SERVICES, INCLUDING ALL COMPLIANCE DOCUMENTS GENERATED THROUGH OUR PLATFORM, ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, GETA2PAPPROVED LLC EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, TIMELINESS, OR UNINTERRUPTED ACCESS.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.2 No Guarantee of Approval</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              GETA2PAPPROVED LLC DOES NOT WARRANT OR GUARANTEE THAT THE COMPLIANCE DOCUMENTS, CONSENT CHECKBOX LANGUAGE, OR APPLICATION ANSWERS GENERATED THROUGH OUR PLATFORM WILL RESULT IN THE APPROVAL OF YOUR A2P 10DLC CAMPAIGN REGISTRATION BY THE CAMPAIGN REGISTRY, ANY WIRELESS CARRIER, OR ANY OTHER REVIEWING AUTHORITY. A2P 10DLC CAMPAIGN REGISTRATION DECISIONS ARE MADE BY THIRD PARTIES — INCLUDING THE CAMPAIGN REGISTRY AND INDIVIDUAL WIRELESS CARRIERS — USING THEIR OWN REVIEW CRITERIA, WHICH MAY CHANGE WITHOUT NOTICE. GETA2PAPPROVED LLC HAS NO CONTROL OVER AND ASSUMES NO RESPONSIBILITY FOR THE REGISTRATION DECISIONS MADE BY ANY THIRD PARTY. YOUR REGISTRATION OUTCOME IS NOT WITHIN OUR CONTROL AND WE MAKE NO REPRESENTATION THAT ANY SPECIFIC OUTCOME WILL BE ACHIEVED.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.3 No Legal Advice</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              GETA2PAPPROVED LLC IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL ADVICE. THE DOCUMENTS GENERATED THROUGH OUR PLATFORM ARE PRODUCED BY AN AI-POWERED DOCUMENT GENERATION ENGINE AND ARE INTENDED SOLELY TO ASSIST WITH A2P 10DLC COMPLIANCE DOCUMENTATION. NOTHING IN THE DOCUMENTS GENERATED BY GETA2PAPPROVED LLC, AND NOTHING IN THESE TERMS &amp; CONDITIONS OR ON OUR SITE, CONSTITUTES LEGAL ADVICE OR CREATES AN ATTORNEY-CLIENT RELATIONSHIP BETWEEN YOU AND GETA2PAPPROVED LLC OR ANY OF ITS PERSONNEL. YOU SHOULD CONSULT WITH A QUALIFIED ATTORNEY LICENSED IN YOUR JURISDICTION BEFORE RELYING ON ANY GENERATED DOCUMENT FOR ANY LEGAL, REGULATORY, OR CONTRACTUAL PURPOSE.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.4 Third-Party Platform Changes</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              THE A2P 10DLC COMPLIANCE LANDSCAPE, INCLUDING CARRIER REQUIREMENTS, CTIA GUIDELINES, THE CAMPAIGN REGISTRY&apos;S REGISTRATION STANDARDS, AND APPLICABLE REGULATIONS, IS SUBJECT TO CHANGE AT ANY TIME WITHOUT NOTICE. GETA2PAPPROVED LLC MAKES NO WARRANTY THAT THE DOCUMENTS GENERATED THROUGH OUR PLATFORM WILL REMAIN COMPLIANT WITH ALL APPLICABLE STANDARDS FOLLOWING ANY SUCH CHANGES. GETA2PAPPROVED LLC ENDEAVORS TO KEEP ITS DOCUMENT GENERATION ENGINE CURRENT WITH KNOWN COMPLIANCE REQUIREMENTS BUT CANNOT GUARANTEE THAT EVERY DOCUMENT GENERATED WILL REFLECT THE MOST CURRENT REQUIREMENTS AT ALL TIMES.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.5 Accuracy of Generated Documents</h3>
            <p className="uppercase text-sm font-medium">
              THE ACCURACY AND COMPLIANCE VALUE OF DOCUMENTS GENERATED BY GETA2PAPPROVED LLC IS DEPENDENT ON THE ACCURACY AND COMPLETENESS OF THE BUSINESS INFORMATION, USE CASE DESCRIPTIONS, AND OTHER DATA YOU PROVIDE WHEN SUBMITTING YOUR PROJECT. GETA2PAPPROVED LLC MAKES NO WARRANTY THAT DOCUMENTS GENERATED BASED ON INACCURATE, INCOMPLETE, OR MISLEADING INFORMATION WILL MEET COMPLIANCE REQUIREMENTS. YOU ARE SOLELY RESPONSIBLE FOR THE ACCURACY OF ALL INFORMATION YOU SUBMIT TO OUR PLATFORM.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Limitation of Liability</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.1 Exclusion of Consequential Damages</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GETA2PAPPROVED LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, MANAGERS, MEMBERS, AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR IN ANY WAY RELATED TO YOUR USE OF OR INABILITY TO USE THE SITE, SERVICES, OR GENERATED DOCUMENTS, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOST PROFITS, LOST REVENUE, LOST BUSINESS OPPORTUNITIES, LOSS OF GOODWILL, LOSS OF DATA, FAILED A2P CAMPAIGN REGISTRATIONS, CARRIER FILTERING OR BLOCKING OF SMS TRAFFIC, OR ANY OTHER INTANGIBLE LOSS, EVEN IF GETA2PAPPROVED LLC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.2 Cap on Liability</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE TOTAL AGGREGATE LIABILITY OF GETA2PAPPROVED LLC TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS &amp; CONDITIONS, THE SITE, THE SERVICES, OR ANY GENERATED DOCUMENTS — WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, STATUTE, OR ANY OTHER LEGAL THEORY — EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT PAID BY YOU TO GETA2PAPPROVED LLC FOR THE SPECIFIC PROJECT GIVING RISE TO THE CLAIM IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE DATE ON WHICH THE CLAIM AROSE, OR (B) FIFTY DOLLARS ($50.00).
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.3 Essential Basis of the Bargain</h3>
            <p>
              You acknowledge and agree that the limitations on liability set forth in this Section 9 are a fundamental element of the basis of the bargain between GetA2PApproved LLC and you, without which GetA2PApproved LLC would not provide the Services at the price offered. You further acknowledge that GetA2PApproved LLC would not enter into this Agreement absent these limitations. To the extent that any jurisdiction does not allow the exclusion or limitation of certain damages, the liability of GetA2PApproved LLC in such jurisdiction shall be limited to the maximum extent permitted by law.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Indemnification</h2>
            <p className="mb-4">
              To the fullest extent permitted by applicable law, you agree to defend, indemnify, and hold harmless GetA2PApproved LLC, its officers, directors, employees, managers, members, agents, licensors, and service providers from and against any and all claims, liabilities, damages, judgments, awards, losses, costs, expenses, and fees — including reasonable attorneys&apos; fees — arising out of or relating to: (a) your use of or access to the Site or Services; (b) your violation of any provision of these Terms &amp; Conditions; (c) your violation of any applicable law or regulation, including without limitation the TCPA, the CAN-SPAM Act, or any carrier A2P 10DLC policy; (d) any false, inaccurate, or misleading information you submit to our platform; (e) your use of any compliance documents generated by GetA2PApproved LLC in connection with any SMS messaging program that does not conform to the information you provided at the time of document generation or that otherwise violates applicable law; (f) any claim by a third party that your SMS messaging practices — including the use of any documents generated through our platform — violate their rights or applicable law; or (g) any infringement or misappropriation by you of any intellectual property rights or other rights of any third party.
            </p>
            <p>
              GetA2PApproved LLC reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you agree to cooperate fully with GetA2PApproved LLC in asserting any available defenses and in providing all information and assistance reasonably requested.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Termination</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.1 Termination by GetA2PApproved LLC</h3>
            <p className="mb-4">
              GetA2PApproved LLC reserves the right to suspend or terminate your access to the Site, platform, or Services — with or without notice, and with or without refund — at any time and for any reason, including but not limited to your breach of any provision of these Terms &amp; Conditions, your provision of false or fraudulent information to our platform, your use of our Services in connection with an unlawful SMS messaging program, any conduct by you that GetA2PApproved LLC believes poses a legal or reputational risk to the company, or any violation of applicable law. Upon termination, your license to use any generated documents remains in effect solely with respect to documents generated and delivered prior to the termination date, subject to the restrictions set forth in Section 6.2.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.2 Termination by You</h3>
            <p className="mb-4">
              You may terminate your use of our Services at any time by ceasing to access the Site and, if applicable, by submitting a written request to close your account to support@geta2papproved.com. Termination of your account does not entitle you to a refund for any completed project or purchase. Any documents generated and delivered prior to the date of account termination remain available to you subject to the license terms set forth in Section 6.2.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.3 Effect of Termination</h3>
            <p className="mb-4">
              Upon any termination of your access to the Services, the following provisions of these Terms &amp; Conditions shall survive and remain in full force and effect: Section 4.3 (Refund Policy), Section 5.10 (Explicit Prohibition on SMS Opt-In Data Sharing), Section 5.11 (SMS Consent Records and Retention), Section 6 (Intellectual Property), Section 7 (Prohibited Conduct), Section 8 (Disclaimers and Warranties), Section 9 (Limitation of Liability), Section 10 (Indemnification), Section 12 (Dispute Resolution and Governing Law), and any other provisions that by their nature should survive termination.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.4 SMS Program Termination</h3>
            <p>
              If your access to the Services is terminated for any reason, GetA2PApproved LLC will continue to honor any pending opt-out requests you have submitted to our SMS messaging program. If you have not previously opted out of our SMS messaging program and your account is terminated, you may still opt out of receiving text messages at any time by replying STOP to any message you receive from us, in accordance with the opt-out procedure described in Section 5.8 of these Terms &amp; Conditions.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. Dispute Resolution and Governing Law</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.1 Governing Law</h3>
            <p className="mb-4">
              These Terms &amp; Conditions and any dispute, claim, or controversy arising out of or relating to these Terms &amp; Conditions, your use of the Site or Services, or any documents generated through our platform shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions. The application of the United Nations Convention on Contracts for the International Sale of Goods is expressly excluded.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.2 Informal Resolution</h3>
            <p className="mb-4">
              Before initiating any formal legal proceeding, you agree to first contact GetA2PApproved LLC at support@geta2papproved.com and describe your dispute in reasonable detail. GetA2PApproved LLC agrees to attempt to resolve your dispute informally within thirty (30) days of receiving your written description of the dispute. You agree to engage in this informal resolution process in good faith before proceeding to arbitration or any other formal dispute resolution mechanism. This informal resolution requirement does not apply to requests for emergency injunctive or other equitable relief to protect intellectual property rights or prevent imminent harm.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.3 Binding Arbitration</h3>
            <p className="mb-4">
              If informal resolution is unsuccessful, any dispute, claim, or controversy arising out of or relating to these Terms &amp; Conditions, your use of the Site or Services, or any breach, termination, enforcement, interpretation, or validity of these Terms &amp; Conditions — including the determination of the scope or applicability of this arbitration agreement — shall be determined by binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association (AAA), as then in effect, except as otherwise provided in these Terms &amp; Conditions. The arbitration shall be conducted by a single, neutral arbitrator. The seat and venue of the arbitration shall be in the State of Wyoming. The arbitrator shall apply Wyoming law to the merits of any dispute. The arbitrator&apos;s award shall be final and binding, and judgment upon the award rendered by the arbitrator may be entered in any court of competent jurisdiction located in the State of Wyoming.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.4 Waiver of Class Action</h3>
            <p className="mb-4 uppercase text-sm font-medium">
              YOU AND GETA2PAPPROVED LLC EACH AGREE THAT ANY ARBITRATION OR LEGAL PROCEEDING SHALL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT, CLASS-WIDE ARBITRATION, PRIVATE ATTORNEY GENERAL ACTION, OR ANY OTHER REPRESENTATIVE PROCEEDING AGAINST GETA2PAPPROVED LLC. IF A COURT OR ARBITRATOR DETERMINES THAT THIS CLASS ACTION WAIVER IS NOT ENFORCEABLE WITH RESPECT TO A PARTICULAR CLAIM, THEN THAT CLAIM SHALL BE SEVERED FROM THE ARBITRATION AND PROCEED IN A COURT OF COMPETENT JURISDICTION IN THE STATE OF WYOMING, AND ALL REMAINING CLAIMS SHALL PROCEED IN ARBITRATION.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.5 Small Claims Court</h3>
            <p className="mb-4">
              Notwithstanding the foregoing arbitration requirement, either party may bring an individual claim in a small claims court of competent jurisdiction in the State of Wyoming, provided that the claim qualifies for small claims court under that court&apos;s jurisdictional rules and the matter remains in small claims court and is not removed or appealed to a court of general jurisdiction.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.6 Jurisdiction for Non-Arbitrable Claims</h3>
            <p className="mb-4">
              For any dispute that is not subject to binding arbitration under Section 12.3 and does not qualify for small claims court under Section 12.5, you agree that such dispute shall be brought exclusively in the state or federal courts of competent jurisdiction located in the State of Wyoming. You hereby consent to the personal jurisdiction of such courts and waive any objection to the laying of venue of any such proceeding in Wyoming. This jurisdiction provision is consistent with the governing law provisions of our Privacy Policy, which is incorporated into these Terms &amp; Conditions by reference.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.7 Time Limitation on Claims</h3>
            <p>
              To the extent permitted by applicable law, any claim arising out of or relating to these Terms &amp; Conditions or your use of the Services must be filed within one (1) year after the claim arose. Claims filed after the expiration of this one-year period are permanently barred, regardless of any statutory limitations period that might otherwise apply.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">13. Severability</h2>
            <p>
              If any provision of these Terms &amp; Conditions is held by a court of competent jurisdiction or an arbitrator to be invalid, illegal, unenforceable, or void in whole or in part for any reason, that provision shall be modified to the minimum extent necessary to make it enforceable, or if it cannot be made enforceable, it shall be deemed severed from these Terms &amp; Conditions. The invalidity, illegality, or unenforceability of any particular provision shall not affect the validity or enforceability of the remaining provisions of these Terms &amp; Conditions, which shall continue in full force and effect as if the invalid, illegal, or unenforceable provision had never been included. Without limiting the foregoing, the class action waiver set forth in Section 12.4 shall be treated as a standalone agreement, and its invalidity shall not affect the enforceability of the arbitration agreement in Section 12.3 except as expressly provided in Section 12.4.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">14. Changes to These Terms &amp; Conditions</h2>
            <p className="mb-4">
              GetA2PApproved LLC reserves the right to update, modify, or replace these Terms &amp; Conditions at any time to reflect changes in our business practices, changes in applicable law or regulation, updates to carrier or CTIA A2P 10DLC compliance requirements, or other legitimate business developments. When we make material changes to these Terms &amp; Conditions, we will update the &ldquo;Last Updated&rdquo; date at the top of this document. Where required by applicable law or where we determine it is appropriate given the nature of the change, we will provide you with advance notice of the change by email to the address associated with your account, by posting a prominent notice on our Site, or both.
            </p>
            <p className="mb-4">
              Your continued use of the Site or Services following the posting of an updated version of these Terms &amp; Conditions on our Site constitutes your acceptance of and agreement to be bound by the updated Terms &amp; Conditions. If you do not agree with any change to these Terms &amp; Conditions, you must discontinue your use of the Site and Services immediately following the effective date of the change.
            </p>
            <p>
              Changes to the SMS messaging provisions of these Terms &amp; Conditions — including any change to message frequency, message types, the opt-in or opt-out procedures, or the content of the consent disclosures — will be communicated to active SMS subscribers in advance of taking effect, as required by CTIA guidelines and applicable A2P 10DLC carrier compliance standards. We encourage you to review these Terms &amp; Conditions periodically to remain informed of the current terms governing your use of our Services.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">15. Miscellaneous</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.1 Entire Agreement</h3>
            <p className="mb-4">
              These Terms &amp; Conditions, together with our Privacy Policy (available at https://www.geta2papproved.com/), constitute the entire agreement between you and GetA2PApproved LLC with respect to your use of the Site and Services and supersede all prior and contemporaneous understandings, agreements, representations, warranties, and communications between you and GetA2PApproved LLC, whether oral or written, regarding the subject matter hereof. In the event of any conflict between these Terms &amp; Conditions and the Privacy Policy, these Terms &amp; Conditions shall control with respect to matters of contract and service use, and the Privacy Policy shall control with respect to matters of data collection, use, and privacy.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.2 No Waiver</h3>
            <p className="mb-4">
              The failure of GetA2PApproved LLC to enforce any right or provision of these Terms &amp; Conditions shall not constitute a waiver of that right or provision. Any waiver of any right or provision of these Terms &amp; Conditions must be in writing and signed by an authorized representative of GetA2PApproved LLC to be effective. A waiver of any right or provision in a particular instance shall not be deemed a waiver of that right or provision in any other instance or on any future occasion.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.3 Assignment</h3>
            <p className="mb-4">
              You may not assign, transfer, delegate, or otherwise dispose of your rights or obligations under these Terms &amp; Conditions, in whole or in part, without the prior written consent of GetA2PApproved LLC. Any purported assignment in violation of this provision shall be null and void. GetA2PApproved LLC may freely assign, transfer, or delegate its rights and obligations under these Terms &amp; Conditions in connection with a merger, acquisition, reorganization, sale of substantially all of its assets, or operation of law, without your prior consent, provided that the assignee assumes all obligations under these Terms &amp; Conditions.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.4 Force Majeure</h3>
            <p className="mb-4">
              GetA2PApproved LLC shall not be liable for any delay or failure in performance resulting from causes beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemics or public health emergencies, acts of war or terrorism, cyberattacks, government actions or regulations, carrier network outages, failures of third-party infrastructure providers (including GoHighLevel or Twilio), internet service disruptions, power outages, labor disputes, or any other event beyond our reasonable control. In the event of a force majeure event, GetA2PApproved LLC will endeavor to provide notice to affected users as promptly as reasonably practicable and will use commercially reasonable efforts to resume performance as soon as the force majeure event has subsided.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.5 Relationship of the Parties</h3>
            <p className="mb-4">
              Nothing in these Terms &amp; Conditions shall be construed to create a partnership, joint venture, employment, franchise, or agency relationship between you and GetA2PApproved LLC. You and GetA2PApproved LLC are independent contracting parties, and neither party has the authority to bind the other or to incur obligations on the other&apos;s behalf.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.6 Headings</h3>
            <p className="mb-4">
              The section headings used in these Terms &amp; Conditions are for convenience and reference purposes only and shall not affect the interpretation or construction of any provision hereof.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">15.7 Electronic Communications</h3>
            <p>
              By using our Site or Services or communicating with us by email, you agree that all agreements, notices, disclosures, and other communications that GetA2PApproved LLC provides to you electronically — including by email and by posting notices on our Site — satisfy any legal requirement that such communications be in writing. You consent to receive communications from GetA2PApproved LLC electronically and agree that electronic communications have the same legal effect as written communications.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">16. Contact Information</h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding these Terms &amp; Conditions, your use of our Services, our SMS messaging program, or any other matter governed by this Agreement, please contact us using any of the following methods:
            </p>
            <div className="space-y-1 mb-4">
              <p><strong>Legal Business Name:</strong> GetA2PApproved LLC</p>
              <p><strong>Mailing Address:</strong> 1124 Dunn Ave, Cheyenne, WY 82001</p>
              <p><strong>Email Address:</strong> support@geta2papproved.com</p>
              <p><strong>Phone Number:</strong> +1 561-593-3173</p>
              <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
            </div>
            <p className="mb-4">
              We are committed to responding to all inquiries promptly and in accordance with our obligations under applicable federal and state law. If you have a specific question or complaint related to our SMS messaging program — including questions about opt-in consent, opt-out processing, message content, or TCPA compliance — please contact us at support@geta2papproved.com or call +1 561-593-3173 and reference &ldquo;SMS Program Inquiry&rdquo; so that your inquiry is handled by the team member responsible for our messaging compliance program. If you are exercising a privacy right under applicable state law, please identify the nature of your request clearly in the subject line of your email or at the beginning of your written correspondence so that your request is routed to the appropriate personnel for handling.
            </p>
          </section>

        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
