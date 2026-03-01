import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";

export const metadata = {
  title: "Privacy Policy | GetA2PApproved",
  description:
    "Read the GetA2PApproved privacy policy. Learn how we collect, use, and protect your data when you use our A2P 10DLC compliance document generation service.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>

        <div className="text-sm text-slate-600 mb-10 space-y-1">
          <p><strong>Business Name:</strong> GetA2PApproved LLC</p>
          <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
          <p><strong>Effective Date:</strong> February 24, 2026</p>
          <p><strong>Last Updated:</strong> February 24, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-8">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p className="mb-4">
              GetA2PApproved LLC (&ldquo;GetA2PApproved LLC,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a Wyoming limited liability company headquartered at 1124 Dunn Ave, Cheyenne, WY 82001. We operate the website located at https://www.geta2papproved.com/ (the &ldquo;Site&rdquo;) and provide an AI-powered compliance document generation service that helps businesses and marketing agencies prepare Privacy Policies, Terms &amp; Conditions, consent checkbox language, and application answers required for A2P 10DLC SMS campaign registration with wireless carriers and The Campaign Registry.
            </p>
            <p className="mb-4">
              This Privacy Policy describes in detail how GetA2PApproved LLC collects, uses, stores, protects, and discloses personal information obtained from visitors to our Site, users of our platform, customers who purchase our services, and individuals who opt in to receive text message communications from us. This Privacy Policy applies to all information collected through our website, purchase and checkout flows, account registration pages, landing page forms, customer support interactions, and any other means by which you interact with GetA2PApproved LLC.
            </p>
            <p className="mb-4">
              This Privacy Policy also governs our SMS and text messaging program, including the nature of the messages we send, how consent is obtained and documented, how opt-outs are honored, and how we protect the privacy of individuals who provide their mobile phone numbers to us. Our SMS messaging practices are designed to comply with the Telephone Consumer Protection Act (TCPA), the guidelines published by the Cellular Telecommunications Industry Association (CTIA), the requirements of The Campaign Registry (TCR), and all applicable wireless carrier A2P 10DLC compliance standards.
            </p>
            <p className="mb-4">
              By accessing or using our Site, completing any form on our platform, purchasing any product or service, or providing your personal information in any context, you acknowledge that you have read and understood this Privacy Policy and that your information will be handled as described herein. If you do not agree with this Privacy Policy, please do not use our Site or services.
            </p>
            <p>
              We encourage you to read this Privacy Policy in its entirety before submitting any personal information to us. If you have questions about any provision of this Privacy Policy, please contact us using the contact information provided in Section 13 of this document before proceeding.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.1 Information You Provide Directly</h3>
            <p className="mb-3">
              GetA2PApproved LLC collects personal information that you voluntarily provide to us when you interact with our Site or services. This includes, but is not limited to, the following categories of information:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li><strong>Contact Information:</strong> Your first and last name, business name, email address, mailing address, and mobile telephone number, which you may provide when completing our landing page forms, contact forms, registration pages, or checkout flows.</li>
              <li><strong>Account Credentials:</strong> If you create an account on our platform, we collect the username and password you select, as well as any profile information you choose to provide.</li>
              <li><strong>Payment Information:</strong> When you purchase a product or service from GetA2PApproved LLC, we collect billing information necessary to process your transaction, including your name, billing address, and payment card details. Payment card data is processed by our third-party payment processor and is not stored on our servers in unencrypted form.</li>
              <li><strong>Business and Campaign Information:</strong> When you use our document generation service, you provide business-specific information, including your legal business name, DBA names, business address, business phone number, business email address, website URL, SMS use case descriptions, message frequency details, opt-in method descriptions, subcontractor names, and other information necessary to generate compliant A2P 10DLC documents. This information is used solely to generate your compliance documents and is treated as confidential business information.</li>
              <li><strong>SMS Opt-In Consent:</strong> When you affirmatively check an SMS consent checkbox on our landing page form, we collect and record your mobile telephone number, the date and time of your consent, the version of the consent language presented to you at the time of opt-in, and the specific campaign (marketing or service texts) to which you consented. This consent record is maintained separately from other forms of contact and is retained in accordance with the data retention provisions set forth in Section 9 of this Privacy Policy.</li>
              <li><strong>Customer Support Communications:</strong> When you contact our customer support team by email or phone, we collect the content of your communications and any personal information you include in your messages.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <p className="mb-3">
              When you visit our Site, certain information is collected automatically through cookies, web beacons, server logs, and similar technologies. This automatically collected information may include:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li><strong>Device Information:</strong> The type of device you use to access the Site, your operating system, browser type and version, screen resolution, and device identifiers.</li>
              <li><strong>Log Data:</strong> Your Internet Protocol (IP) address, the pages you visit on our Site, the date and time of your visit, the amount of time you spend on each page, referring URLs, and other browsing activity data.</li>
              <li><strong>Cookie Data:</strong> We use cookies and similar tracking technologies to recognize your browser, remember your preferences, analyze traffic patterns, and improve the functionality of our Site. You may configure your browser to refuse cookies, but doing so may affect your ability to use certain features of our Site.</li>
              <li><strong>Analytics Data:</strong> We use third-party analytics providers to help us understand how users interact with our Site. These providers may collect information about your visits to our Site and other websites over time. This data is used in aggregated and anonymized form to improve our services.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">2.3 Information We Do Not Collect</h3>
            <p>
              GetA2PApproved LLC does not knowingly collect sensitive personal information such as Social Security numbers, government-issued identification numbers, health or medical information, financial account numbers (beyond what is necessary for payment processing), or biometric data. We do not collect information from individuals under the age of thirteen (13), and our services are intended exclusively for adults and business entities. We do not purchase, rent, or acquire personal information from data brokers, list vendors, or any third-party lead generation sources for use in our SMS messaging program.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use the Information We Collect</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.1 Service Delivery and Platform Operation</h3>
            <p className="mb-4">
              We use the personal information you provide primarily to deliver the services you have requested. Specifically, we use your information to generate your A2P 10DLC compliance documents, including your Privacy Policy, Terms &amp; Conditions, consent checkbox language, and application answers. The business and campaign information you provide is used exclusively within our document generation engine to produce documents that are specific and accurate to your business.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.2 Order Processing and Account Management</h3>
            <p className="mb-4">
              We use your contact and payment information to process your purchase, deliver your completed documents, send payment receipts and order confirmations, grant access to your completed files or account dashboard, and communicate with you about the status of your order or project submission. These communications are service-related and are sent regardless of whether you have opted in to marketing text messages.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.3 SMS and Text Message Communications</h3>
            <p className="mb-4">
              If you have affirmatively opted in to receive text messages from GetA2PApproved LLC by checking the designated SMS consent checkbox on our landing page form, we will use your mobile telephone number to send you text messages as described in detail in Section 5 of this Privacy Policy. We do not send marketing text messages to any individual who has not affirmatively opted in to receive them. We do not send service text messages to individuals who have not provided a mobile telephone number in connection with a transaction or account activity on our platform.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.4 Customer Support</h3>
            <p className="mb-4">
              We use your personal information to respond to your customer support inquiries, resolve billing or access issues, and provide assistance related to your A2P compliance documents or platform account. Support interactions may be logged and retained for quality assurance, compliance documentation, and dispute resolution purposes.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.5 Service Improvement and Analytics</h3>
            <p className="mb-4">
              We use aggregated and anonymized data derived from user interactions with our Site and platform to analyze usage trends, identify areas for improvement, test new features, and optimize the performance of our AI-powered document generation engine. Staff training uses anonymized or aggregated data and does not involve the disclosure of individual client personal information to unauthorized personnel.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.6 Legal Compliance and Enforcement</h3>
            <p className="mb-4">
              We may use your personal information to comply with applicable federal, state, and local laws and regulations, including the TCPA, CTIA guidelines, and A2P 10DLC carrier requirements. We may also use your information to enforce our Terms &amp; Conditions, protect our legal rights, investigate potential violations, and respond to lawful requests from government authorities or law enforcement agencies.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">3.7 Communications About Our Services</h3>
            <p>
              If you have provided your email address in connection with a purchase or account registration, we may use that email address to send you service-related notifications, updates about your compliance documents, information about changes to our platform, and, where permitted by applicable law and with appropriate consent, promotional communications about our services. You may opt out of promotional email communications at any time by clicking the unsubscribe link in any marketing email or by contacting us at support@geta2papproved.com.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Legal Basis for Processing</h2>
            <p className="mb-3">GetA2PApproved LLC processes your personal information on the following legal bases, as applicable under federal and state law:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Contractual Necessity:</strong> Processing your personal information is necessary to fulfill the contract we enter into with you when you purchase our services, including generating your compliance documents, processing your payment, and delivering your completed files.</li>
              <li><strong>Legitimate Interests:</strong> We process certain information based on our legitimate business interests, including improving our platform, preventing fraud, ensuring the security of our systems, and communicating with customers about their orders. We ensure that our legitimate interests do not override your fundamental privacy rights.</li>
              <li><strong>Consent:</strong> Where we rely on consent as a legal basis — most notably for SMS marketing text messages — that consent is obtained through an explicit, affirmative, unchecked opt-in checkbox at the point of data collection. You may withdraw your consent at any time by following the opt-out procedures described in Section 5 of this Privacy Policy.</li>
              <li><strong>Legal Obligation:</strong> We may process your personal information where necessary to comply with a legal obligation imposed by applicable federal or state law, including obligations under the TCPA, CTIA guidelines, and carrier A2P 10DLC compliance frameworks.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. SMS and Text Messaging</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.1 Overview of Our Messaging Program</h3>
            <p className="mb-4">
              GetA2PApproved LLC operates a text messaging program through which we send two distinct categories of messages to individuals who have affirmatively opted in to receive them: (1) marketing text messages promoting our AI-powered A2P 10DLC compliance document generation service, and (2) service text messages triggered by specific customer actions on our platform. Both categories of messages are sent exclusively to individuals who have provided explicit, prior written consent through the designated opt-in mechanism described in Section 5.3 of this Privacy Policy. Our SMS messaging program is operated through GoHighLevel and delivered via Twilio&apos;s messaging infrastructure.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.2 Description of Message Types</h3>
            <p className="mb-3">
              <strong>Marketing Text Messages:</strong> GetA2PApproved LLC sends marketing text messages to prospects and existing customers who have explicitly opted in to receive marketing communications from us. These messages are used to promote our AI-powered A2P 10DLC compliance document generation service and may include: announcements about new features or platform updates, limited-time pricing offers and promotional discounts, reminders to complete your A2P registration documents, and educational tips related to SMS compliance and campaign approval. Marketing messages are sent at a frequency of up to 8 messages per month. The exact number of messages you receive may vary depending on your activity on our platform and the campaigns active at the time.
            </p>
            <p className="mb-4">
              <strong>Service Text Messages:</strong> GetA2PApproved LLC sends service text messages to customers to support their use of our platform following a purchase or sign-up. These messages are triggered directly by customer actions and may include: order confirmations, payment receipts, delivery of access credentials or links to completed compliance documents, confirmation that a project submission has been received, and status updates regarding the progress of your A2P compliance document generation. Service text messages contain no promotional content and are sent only when triggered by your account activity. The frequency of service text messages varies and is determined entirely by your individual account activity.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.3 How to Opt In</h3>
            <p className="mb-4">
              Consent to receive text messages from GetA2PApproved LLC is obtained exclusively through an affirmative, unchecked opt-in checkbox presented at the point of data collection on our landing page form. The phone number field on our landing page form is required; however, providing your phone number alone does not constitute consent to receive text messages.
            </p>
            <p className="mb-4">
              Providing your phone number on our contact forms, registration pages, or intake forms does not, by itself, constitute consent to receive SMS text messages from GetA2PApproved LLC. Consent to receive text messages is obtained separately through an affirmative, unchecked checkbox specifically designated for SMS consent at the point of opt-in.
            </p>
            <p>
              Our landing page form presents two separate SMS consent checkboxes — one for marketing text messages and one for service text messages — so that users can provide granular consent to each category of communication independently. Neither checkbox is pre-checked. You must affirmatively check each checkbox to consent to that category of messages. Links to this Privacy Policy and our Terms &amp; Conditions are displayed in the footer of all forms containing SMS consent checkboxes.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.4 Consent Disclosure</h3>
            <p className="mb-3">The consent disclosures presented to users at the point of opt-in read as follows:</p>
            <p className="mb-2"><strong>Marketing Consent Disclosure:</strong></p>
            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-4">
              &ldquo;I agree to receive marketing texts from GetA2PApproved LLC (e.g. offers, new features, compliance tips). Up to 8 msgs/mo. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for info. Consent not required for purchase. SMS opt-in data is never shared with third parties.&rdquo;
            </blockquote>
            <p className="mb-2"><strong>Service Text Consent Disclosure:</strong></p>
            <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-4">
              &ldquo;I agree to receive service texts from GetA2PApproved LLC (e.g. order confirmations, payment receipts, document delivery, project status updates). Msgs sent only when triggered by account activity. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for info. SMS opt-in data is never shared with third parties.&rdquo;
            </blockquote>
            <p>
              These disclosures are displayed directly adjacent to the corresponding SMS consent checkbox. Both disclosures confirm: the specific type of messages to be sent, the message frequency or triggering condition, that message and data rates may apply, how to opt out by replying STOP, how to request help by replying HELP, and that SMS opt-in data is never shared with third parties.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.5 Message Frequency</h3>
            <p className="mb-4">
              Marketing text messages are sent at a frequency of up to 8 messages per month. The exact number of marketing messages you receive in any given month may vary based on active campaigns and your account activity but will not exceed 8 messages per calendar month.
            </p>
            <p>
              Service text messages are sent only when triggered by your individual account activity on our platform. These include actions such as completing a purchase, receiving a payment confirmation, having a document generation project completed, or receiving a status update on a pending submission. Because service messages are event-driven, the frequency of these messages depends entirely on how frequently you take actions on our platform. There is no set number of service messages per month.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.6 Message and Data Rates</h3>
            <p>
              Message and data rates may apply to all text messages sent by GetA2PApproved LLC. The rates charged for receiving text messages from us are determined by your individual mobile carrier and rate plan. GetA2PApproved LLC does not charge any fee for sending text messages to you, but your wireless carrier&apos;s standard messaging and data rates will apply to each message you receive. Please contact your wireless carrier if you are unsure whether your plan includes unlimited text messaging or whether additional charges apply.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.7 Supported Carriers</h3>
            <p>
              GetA2PApproved LLC&apos;s text messaging program is compatible with the major United States wireless carriers, including but not limited to AT&amp;T, Verizon, T-Mobile, Boost Mobile, MetroPCS, and U.S. Cellular. Carrier support for short code, long code, and toll-free messaging may vary. GetA2PApproved LLC is not responsible for delayed or undelivered messages resulting from carrier filtering, network congestion, or technical issues beyond our control.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.8 How to Opt Out</h3>
            <p className="mb-4">
              You may opt out of receiving text messages from GetA2PApproved LLC at any time by replying STOP to any text message you receive from us. Upon receipt of your STOP reply, GetA2PApproved LLC will process your opt-out request promptly and you will receive a single opt-out confirmation message acknowledging your request. The opt-out confirmation message will identify GetA2PApproved LLC by name and confirm that no further messages will be sent. No additional marketing or service text messages will be sent to your mobile number following receipt and processing of your STOP request, except as required by law or as necessary to deliver a single opt-out confirmation.
            </p>
            <p>
              If you wish to re-enroll in our SMS messaging program after opting out, you may text START to +1 561-593-3173 or re-submit your SMS consent through the opt-in checkbox on our website contact form at https://www.geta2papproved.com/.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">5.9 How to Get Help</h3>
            <p className="mb-3">
              You may request help or information about our text messaging program at any time by replying HELP to any text message you receive from GetA2PApproved LLC. You will receive a response message containing our business name, a brief description of the messaging program, and instructions for opting out. You may also contact us for support related to our text messaging program using the following contact methods:
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
              This prohibition applies regardless of whether any third party has entered into a confidentiality agreement with GetA2PApproved LLC, regardless of whether compensation is offered or received, and regardless of the purpose for which the third party seeks to use the data. Our subcontractors GoHighLevel and Twilio are engaged solely as data processors to facilitate the technical delivery of text messages on our behalf and are expressly prohibited from using SMS opt-in data for any purpose other than message delivery in accordance with our instructions. These subcontractors do not receive SMS opt-in data for their own marketing purposes, do not share such data with additional third parties, and are contractually bound to handle such data in compliance with applicable law.
            </p>
            <p>
              We do not purchase, rent, or acquire personal information from data brokers, list vendors, or any third-party lead generation sources for use in our SMS messaging program. All individuals in our SMS messaging program have consented directly through our own opt-in forms. We do not participate in any affiliate-driven lead generation programs, co-registration arrangements, or shared opt-in networks in connection with our SMS messaging program.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Data Sharing and Third-Party Disclosure</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.1 General Policy on Data Sharing</h3>
            <p className="mb-4">
              GetA2PApproved LLC does not sell, rent, trade, or otherwise transfer your personal information to third parties for their own marketing, advertising, or commercial purposes. We share your personal information only in the limited circumstances described in this Section 6 and only to the extent necessary to fulfill the purposes for which the information was collected.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.2 Service Providers and Subcontractors</h3>
            <p className="mb-3">
              We engage third-party service providers and technology subcontractors to assist us in operating our website, delivering our services, processing payments, and sending text messages. These third-party service providers are permitted to access your personal information only to perform specific functions on our behalf and are contractually prohibited from using your personal information for any purpose other than providing services to GetA2PApproved LLC.
            </p>
            <p className="mb-3">Our current technology subcontractors engaged in the processing of personal information include:</p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li><strong>GoHighLevel:</strong> GetA2PApproved LLC uses GoHighLevel as its primary CRM and marketing automation platform. GoHighLevel facilitates the storage and management of customer records, form submissions, and SMS campaign delivery on our behalf. GoHighLevel processes personal information solely as a data processor acting under our instructions and is prohibited from using your data for its own purposes.</li>
              <li><strong>Twilio:</strong> GetA2PApproved LLC uses Twilio as its underlying SMS messaging infrastructure provider. Twilio processes mobile telephone numbers and message content solely to facilitate the technical delivery of text messages sent by GetA2PApproved LLC. Twilio does not receive SMS opt-in data for its own marketing purposes and is contractually bound to handle such data in compliance with applicable law and Twilio&apos;s own published privacy and data processing agreements.</li>
            </ul>
            <p>
              We do not pass leads or customer information to third parties for sales, marketing, or any other commercial purpose. All leads collected through our forms are handled internally by GetA2PApproved LLC. We do not participate in affiliate tracking programs or share lead data with affiliate networks.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.3 Legal Requirements and Law Enforcement</h3>
            <p className="mb-4">
              GetA2PApproved LLC may disclose your personal information if required to do so by law, court order, subpoena, or other legal process, or if we have a good-faith belief that such disclosure is necessary to comply with applicable law, respond to a government or law enforcement request, protect the safety of any person, prevent fraud or illegal activity, or protect the legal rights, property, or interests of GetA2PApproved LLC.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.4 Business Transfers</h3>
            <p className="mb-4">
              In the event that GetA2PApproved LLC is involved in a merger, acquisition, asset sale, reorganization, or other business transfer, your personal information may be transferred as part of that transaction. In the event of such a transfer, we will provide notice on our website and, where required by applicable law, seek your consent before your personal information is transferred to a successor entity and becomes subject to a different privacy policy.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">6.5 Aggregated and De-Identified Data</h3>
            <p>
              GetA2PApproved LLC may share aggregated, de-identified, or anonymized data — data that cannot reasonably be used to identify any individual — with third parties for research, analytics, industry reporting, or other legitimate business purposes. Staff training uses anonymized or aggregated data and does not involve the disclosure of individual client personal information to unauthorized personnel. Aggregated or de-identified data is not personal information and is not subject to the protections described in this Privacy Policy.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Data Security</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.1 Security Measures</h3>
            <p className="mb-3">
              GetA2PApproved LLC implements commercially reasonable technical, administrative, and physical security measures designed to protect your personal information against unauthorized access, disclosure, alteration, destruction, or loss. These measures include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Encryption of data in transit using Secure Sockets Layer (SSL) / Transport Layer Security (TLS) protocols on all pages of our Site where personal information is submitted or transmitted.</li>
              <li>Access controls limiting access to personal information to authorized personnel who require such access to perform their job functions.</li>
              <li>Use of reputable, enterprise-grade cloud infrastructure and subcontractors (including GoHighLevel and Twilio) that maintain their own security programs consistent with industry standards.</li>
              <li>Periodic review of our data handling practices and security controls to identify and address potential vulnerabilities.</li>
              <li>Secure storage of SMS opt-in consent records with access logging to prevent unauthorized modification or deletion.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">7.2 Limitations of Security</h3>
            <p>
              While we take the security of your personal information seriously and employ commercially reasonable safeguards, no method of electronic transmission or storage is completely secure. GetA2PApproved LLC cannot guarantee absolute security of your personal information and cannot be responsible for breaches resulting from factors outside our reasonable control, including but not limited to cyberattacks, malware, unauthorized access by third parties, or failures in third-party infrastructure. In the event of a data breach affecting your personal information, we will notify affected individuals as required by applicable law.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Cookies and Tracking Technologies</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.1 Types of Cookies We Use</h3>
            <p className="mb-3">
              GetA2PApproved LLC uses cookies and similar tracking technologies on our Site to enhance your browsing experience, analyze Site traffic, and support our marketing efforts. Cookies are small text files stored on your device by your web browser when you visit our Site. We use the following categories of cookies:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li><strong>Strictly Necessary Cookies:</strong> These cookies are essential for the operation of our Site and cannot be disabled. They enable core functionality such as session management, security, and access to password-protected areas of our platform.</li>
              <li><strong>Performance and Analytics Cookies:</strong> These cookies collect information about how visitors use our Site, including which pages are visited most frequently and whether users encounter error messages. This data is used in aggregated form to improve the performance and usability of our Site.</li>
              <li><strong>Functional Cookies:</strong> These cookies allow our Site to remember your preferences, such as your selected language or form completion progress, to provide a more personalized experience.</li>
              <li><strong>Marketing and Advertising Cookies:</strong> These cookies may be set by us or by third-party advertising partners to track your browsing activity across websites and deliver targeted advertisements relevant to your interests. We do not use marketing cookies in connection with our SMS opt-in processes.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">8.2 Managing Cookies</h3>
            <p>
              You may configure your browser settings to refuse some or all cookies, or to alert you when cookies are being set. Please note that disabling certain cookies may affect the functionality of our Site and your ability to access certain features. Instructions for managing cookies in common browsers are available through your browser&apos;s help function or at www.allaboutcookies.org. Our Site does not currently respond to browser &ldquo;Do Not Track&rdquo; signals; however, we do not use tracking cookies in connection with our SMS messaging consent processes.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Data Retention</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.1 General Retention Principles</h3>
            <p className="mb-4">
              GetA2PApproved LLC retains personal information only for as long as necessary to fulfill the purposes for which it was collected, to comply with our legal obligations, to resolve disputes, and to enforce our agreements. The specific retention periods applicable to different categories of personal information are set forth below.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.2 Customer and Transaction Records</h3>
            <p className="mb-4">
              Personal information associated with customer accounts and purchase transactions — including your name, email address, billing information, and order history — is retained for a minimum of seven (7) years from the date of the most recent transaction or account activity, consistent with applicable commercial recordkeeping and tax compliance obligations. After the applicable retention period, this information is securely deleted or anonymized in a manner that prevents re-identification.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.3 Business and Campaign Information</h3>
            <p className="mb-4">
              Business and campaign information you provide for the purpose of generating your A2P 10DLC compliance documents is retained for as long as your account remains active and for a reasonable period thereafter sufficient to allow you to retrieve your documents, request revisions, or contact our support team with questions about your generated documents. Upon written request for deletion, this information will be securely deleted subject to any applicable legal retention obligations.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.4 SMS Opt-In Consent Records</h3>
            <p className="mb-4">
              SMS opt-in consent records — including the mobile telephone number provided at opt-in, the date and time of consent, the version of consent language presented to the user at opt-in, and the specific messaging program to which consent was given — are retained for a minimum of five (5) years from the date consent was obtained. This retention period is necessary to demonstrate compliance with the TCPA, CTIA guidelines, and A2P 10DLC carrier requirements in the event of an audit, dispute, regulatory inquiry, or litigation.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.5 SMS Opt-Out Records</h3>
            <p className="mb-4">
              SMS opt-out records, including the date and time of each STOP request received and processed, are retained permanently to ensure that opted-out mobile numbers are never reactivated without a new affirmative opt-in consent.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.6 Customer Support Records</h3>
            <p className="mb-4">
              Records of customer support interactions, including email correspondence and notes from phone support sessions, are retained for a minimum of three (3) years from the date of the interaction to support quality assurance, dispute resolution, and compliance documentation purposes.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">9.7 Automatically Collected Data</h3>
            <p>
              Log files, IP addresses, and other automatically collected device and browsing data are typically retained for a period of up to twelve (12) months, after which they are deleted or anonymized. Aggregated analytics data that cannot be associated with any individual may be retained indefinitely for business improvement purposes.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Your Privacy Rights</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.1 General Rights</h3>
            <p className="mb-4">
              Depending on your location and applicable law, you may have certain rights with respect to the personal information we hold about you. GetA2PApproved LLC is committed to honoring these rights to the fullest extent required by applicable federal and state law. The rights described in this Section 10 may be exercised by submitting a written request to us using the contact information provided in Section 13 of this Privacy Policy.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.2 Right to Access</h3>
            <p className="mb-4">
              You have the right to request access to the personal information that GetA2PApproved LLC holds about you. Upon receiving a verifiable request, we will provide you with a copy of the personal information we hold about you, including the categories of information collected, the purposes for which it is used, and the categories of third parties with whom it has been shared, if any.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.3 Right to Correction</h3>
            <p className="mb-4">
              You have the right to request that we correct any inaccurate or incomplete personal information we hold about you. If you believe that any information we hold about you is inaccurate, you may contact us with a correction request, and we will update your information as promptly as reasonably practicable.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.4 Right to Deletion</h3>
            <p className="mb-4">
              You have the right to request that GetA2PApproved LLC delete the personal information we hold about you, subject to certain exceptions. We may be required to retain certain information to comply with our legal obligations (including TCPA and CTIA compliance documentation requirements), resolve disputes, prevent fraud, enforce our agreements, or complete pending transactions. Where deletion is not legally required, we will honor deletion requests promptly upon verification of identity.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.5 Right to Opt Out of SMS Communications</h3>
            <p className="mb-4">
              You have the right to opt out of receiving text messages from GetA2PApproved LLC at any time, without penalty, by replying STOP to any text message you receive from us. This right is described in greater detail in Section 5.8 of this Privacy Policy. Opting out of text messages does not affect your ability to use our services or access your account.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.6 Right to Data Portability</h3>
            <p className="mb-4">
              To the extent required by applicable law, you have the right to receive the personal information you have provided to GetA2PApproved LLC in a structured, commonly used, machine-readable format, and to request that we transmit that information to another controller where technically feasible.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">10.7 How to Exercise Your Rights</h3>
            <p>
              To exercise any of the rights described in this Section 10, please submit a written request to GetA2PApproved LLC by email at support@geta2papproved.com or by mail at 1124 Dunn Ave, Cheyenne, WY 82001. We may need to verify your identity before processing your request. We will respond to all verifiable requests within the timeframe required by applicable law, and in no event later than forty-five (45) days from the date we receive your request, unless an extension is required and permitted by law.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Children&apos;s Privacy</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.1 No Collection of Information from Minors</h3>
            <p className="mb-4">
              GetA2PApproved LLC&apos;s website and services are intended exclusively for adults and business entities. Our platform is designed to assist businesses, marketing agencies, and adult professionals with A2P 10DLC compliance documentation and SMS campaign registration. We do not knowingly collect, use, or disclose personal information from any individual under the age of thirteen (13).
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.2 Compliance with COPPA</h3>
            <p className="mb-4">
              GetA2PApproved LLC complies with the Children&apos;s Online Privacy Protection Act (COPPA), 15 U.S.C. &sect; 6501 et seq., and the regulations promulgated thereunder by the Federal Trade Commission. We do not direct any of our services or marketing efforts toward children under the age of thirteen. If we discover that we have inadvertently collected personal information from a child under the age of thirteen, we will delete that information from our systems immediately upon discovery.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">11.3 Notification of Inadvertent Collection</h3>
            <p>
              If you are a parent or legal guardian and you believe that your child under the age of thirteen has submitted personal information to GetA2PApproved LLC without your knowledge or consent, please contact us immediately at support@geta2papproved.com or at 1124 Dunn Ave, Cheyenne, WY 82001. We will investigate the matter and take prompt action to delete the information from our systems.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. California Privacy Rights</h2>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.1 Applicability</h3>
            <p className="mb-4">
              GetA2PApproved LLC serves customers located throughout the United States, including customers who are residents of the State of California. The provisions of this Section 12 apply specifically to California residents and are intended to satisfy the requirements of the California Consumer Privacy Act of 2018 (CCPA), as amended by the California Privacy Rights Act of 2020 (CPRA), Cal. Civ. Code &sect; 1798.100 et seq., and any regulations promulgated thereunder by the California Privacy Protection Agency.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.2 Categories of Personal Information Collected</h3>
            <p className="mb-3">
              In the twelve (12) months preceding the Effective Date of this Privacy Policy, GetA2PApproved LLC has collected the following categories of personal information from consumers, as those categories are defined under the CCPA/CPRA:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Identifiers:</strong> Real name, email address, IP address, mobile telephone number, account name, and similar identifiers.</li>
              <li><strong>Customer Records:</strong> Name, contact information, billing address, and payment information as defined under Cal. Civ. Code &sect; 1798.80(e).</li>
              <li><strong>Commercial Information:</strong> Records of products or services purchased, purchase price, order history, and payment transaction records.</li>
              <li><strong>Internet or Other Electronic Network Activity Information:</strong> Browsing history on our Site, search queries submitted through our Site, and interaction data with our platform features.</li>
              <li><strong>Geolocation Data:</strong> General geographic location inferred from IP address data.</li>
              <li><strong>Inferences:</strong> Inferences drawn from the above categories of information to create a profile reflecting your preferences, interests, and interaction patterns with our platform.</li>
              <li><strong>Sensitive Personal Information:</strong> To the extent that account login credentials constitute sensitive personal information under the CPRA, we collect this information solely for the purpose of enabling access to your account.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.3 Purposes for Collection</h3>
            <p className="mb-4">
              The categories of personal information described in Section 12.2 are collected for the purposes described in Section 3 of this Privacy Policy, including service delivery, order processing, customer support, SMS communications (where consent has been obtained), legal compliance, and service improvement.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.4 No Sale of Personal Information</h3>
            <p className="mb-4">
              GetA2PApproved LLC does not sell your personal information to third parties, as that term is defined under the CCPA/CPRA. We do not sell or share personal information for cross-context behavioral advertising purposes. California residents therefore have no right to opt out of the sale of personal information because we do not engage in the sale of personal information.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.5 California Consumer Rights Under the CCPA/CPRA</h3>
            <p className="mb-3">California residents have the following rights with respect to their personal information under the CCPA/CPRA:</p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li><strong>Right to Know:</strong> The right to request that GetA2PApproved LLC disclose the categories and specific pieces of personal information we have collected about you, the categories of sources from which your personal information was collected, the business or commercial purposes for collecting your personal information, and the categories of third parties with whom we share your personal information.</li>
              <li><strong>Right to Delete:</strong> The right to request that GetA2PApproved LLC delete personal information we have collected from you, subject to the exceptions described in Section 10.4 of this Privacy Policy and any applicable exceptions under the CCPA/CPRA.</li>
              <li><strong>Right to Correct:</strong> The right to request that GetA2PApproved LLC correct inaccurate personal information we maintain about you.</li>
              <li><strong>Right to Non-Discrimination:</strong> The right not to receive discriminatory treatment for exercising any of your privacy rights under the CCPA/CPRA. GetA2PApproved LLC will not deny you services, charge you a different price, provide you a different quality of service, or retaliate against you in any way as a result of your exercise of any privacy right.</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> The right to direct us to limit the use of your sensitive personal information to uses that are necessary to provide the services you have requested.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.6 How California Residents May Exercise Their Rights</h3>
            <p className="mb-4">
              California residents may exercise the rights described in Section 12.5 by submitting a verifiable consumer request to GetA2PApproved LLC by email at support@geta2papproved.com or by mail at 1124 Dunn Ave, Cheyenne, WY 82001. We will respond to verifiable consumer requests within forty-five (45) days of receipt. If we require additional time, we will notify you of the extension and the reason for it within the initial forty-five (45) day period. You may submit a request on behalf of a California resident if you are that person&apos;s authorized representative under California law.
            </p>

            <h3 className="text-base font-semibold text-slate-900 mt-4 mb-2">12.7 California &ldquo;Shine the Light&rdquo; Law</h3>
            <p>
              California Civil Code Section 1798.83 (California&apos;s &ldquo;Shine the Light&rdquo; law) permits residents of California to request, once per calendar year, information regarding the disclosure of their personal information to third parties for those third parties&apos; direct marketing purposes. GetA2PApproved LLC does not disclose your personal information to third parties for their direct marketing purposes. Accordingly, requests under California Civil Code Section 1798.83 are not applicable to our current data sharing practices; however, California residents who have questions about our practices may contact us at support@geta2papproved.com.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">13. Third-Party Websites and Links</h2>
            <p>
              Our Site may contain links to third-party websites, resources, or services that are not owned or controlled by GetA2PApproved LLC. These links are provided for your convenience and informational purposes only. GetA2PApproved LLC has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. This Privacy Policy applies only to information collected by GetA2PApproved LLC through our own Site and services. We strongly encourage you to review the privacy policy of any third-party website you visit before submitting any personal information to that website.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">14. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              GetA2PApproved LLC reserves the right to update, modify, or replace this Privacy Policy at any time to reflect changes in our data handling practices, changes in applicable law or regulation, updates to carrier or CTIA compliance requirements, or other business developments. When we make material changes to this Privacy Policy, we will update the &ldquo;Last Updated&rdquo; date at the top of this document and, where required by applicable law, provide you with advance notice of the change by email or by posting a prominent notice on our Site.
            </p>
            <p className="mb-4">
              Your continued use of our Site or services following the posting of an updated Privacy Policy constitutes your acknowledgment of, and agreement to be bound by, the updated Privacy Policy. If you do not agree with the terms of the updated Privacy Policy, you must discontinue your use of our Site and services. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your personal information.
            </p>
            <p>
              If we make changes to our SMS messaging practices — including changes to message frequency, the types of messages sent, or the manner in which consent is obtained or revoked — those changes will be reflected in an updated version of this Privacy Policy and communicated to active SMS subscribers as required by applicable CTIA guidelines and carrier A2P 10DLC compliance standards.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">15. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to this Privacy Policy that is not subject to binding arbitration under our Terms &amp; Conditions shall be brought exclusively in the state or federal courts of competent jurisdiction located in the State of Wyoming, and you hereby consent to the personal jurisdiction of such courts.
            </p>
          </section>

          {/* Section 16 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">16. Contact Information</h2>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or the manner in which GetA2PApproved LLC handles your personal information, please contact us using any of the following methods:
            </p>
            <div className="space-y-1 mb-4">
              <p><strong>Legal Business Name:</strong> GetA2PApproved LLC</p>
              <p><strong>Mailing Address:</strong> 1124 Dunn Ave, Cheyenne, WY 82001</p>
              <p><strong>Email Address:</strong> support@geta2papproved.com</p>
              <p><strong>Phone Number:</strong> +1 561-593-3173</p>
              <p><strong>Website:</strong> https://www.geta2papproved.com/</p>
            </div>
            <p className="mb-4">
              We are committed to responding to all privacy-related inquiries promptly and in accordance with our obligations under applicable federal and state law. If you are a California resident exercising rights under the CCPA/CPRA, please identify your request as a &ldquo;California Privacy Rights Request&rdquo; in the subject line of your email or at the beginning of your written correspondence to ensure your request is routed to the appropriate personnel for handling.
            </p>
            <p>
              If you are an individual whose mobile telephone number is enrolled in one of our SMS messaging programs and you have a question or complaint about how we handle SMS opt-in or opt-out requests, please contact us at support@geta2papproved.com or call +1 561-593-3173 and reference &ldquo;SMS Program Inquiry&rdquo; so that your inquiry is handled by the team member responsible for our messaging compliance program.
            </p>
          </section>

        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
