import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase";
import { isProhibitedIndustry, isRestrictedIndustry, getSelectedRestricted, getUseCaseLabel, determineUseCase } from "@/lib/questionnaires/a2p-compliance";

export const maxDuration = 800; // ~13 minutes

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

async function fetchSingleUrl(url: string): Promise<string> {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.protocol.startsWith("http")) return "";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url.trim(), {
      signal: controller.signal,
      headers: { "User-Agent": "GetA2PApproved/1.0" },
    });
    clearTimeout(timeout);

    if (!res.ok) return "";

    const html = await res.text();
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length > 3000) text = text.substring(0, 3000) + "...";
    return text;
  } catch {
    return "";
  }
}

async function fetchWebsiteContent(urlsRaw: string): Promise<string> {
  // Parse one URL per line (or comma-separated)
  const urls = urlsRaw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter((u) => u.startsWith("http"));

  if (urls.length === 0) return "";

  // Fetch up to 5 URLs in parallel
  const results = await Promise.all(urls.slice(0, 5).map(fetchSingleUrl));

  return urls
    .slice(0, 5)
    .map((url, i) => (results[i] ? `--- ${url} ---\n${results[i]}` : ""))
    .filter(Boolean)
    .join("\n\n");
}

const SYSTEM_PROMPT = `You are an expert legal document generator specializing in A2P 10DLC compliance. Your job is to generate privacy policies and terms & conditions that will pass the strictest possible carrier review for A2P 10DLC campaign registration. Write as if the most rigorous A2P compliance reviewer will scrutinize every word.

CRITICAL REQUIREMENTS:
1. Documents must be professionally formatted and legally structured
2. All A2P-specific sections must be included (SMS consent, opt-in/opt-out, message frequency, TCPA compliance)
3. Output must be clean, well-organized HTML that can be directly copy-pasted
4. Use proper legal language while remaining clear and understandable
5. Include all required disclosures for carrier compliance
6. Ensure TCPA, CTIA, and carrier-specific requirements are addressed
7. The SMS/messaging section must explicitly state: consent is not shared with third parties, users can opt out by replying STOP, message and data rates may apply, and the exact message frequency
8. Write EVERY section in FULL — do not use shortcuts, placeholders, "[insert here]" markers, or abbreviated language
9. Every paragraph must be fully written out with complete legal language — no paraphrasing, no summarizing, no "etc."
10. The document should be COMPREHENSIVE and PRODUCTION-READY — the user should be able to copy-paste it directly onto their website with zero edits needed
11. STAFF TRAINING CLAUSE: Whenever mentioning staff training in any data use or data processing section, include this exact sentence: "Staff training uses anonymized or aggregated data and does not involve the disclosure of individual client personal information to unauthorized personnel." This prevents reviewers from questioning whether real client SMS data is used in AI or automated training systems.
12. VERBATIM CONSENT LANGUAGE — STRICT REQUIREMENTS: The SMS/Text Messaging section MUST include a subsection labeled "Consent Disclosure" containing the exact quoted text users see at the point of opt-in. This quoted block MUST contain ALL SIX of the following elements — every one is mandatory, no exceptions, no omissions:
    (a) The specific message type and business name
    (b) Message frequency — exact number from questionnaire data
    (c) "Msg &amp; data rates may apply."
    (d) "Reply STOP to opt out." — MANDATORY inside the quoted consent block
    (e) "Reply HELP for info." — MANDATORY inside the quoted consent block. This is a CTIA requirement. It MUST appear in the consent disclosure. Do NOT omit it, do NOT move it to a different section.
    (f) "SMS opt-in data is never shared with third parties." — MANDATORY inside the quoted consent block. Carriers specifically require this at the point of consent. It MUST appear inside the quoted consent block, not just in surrounding prose.
    EXAMPLE FORMAT (follow this exactly, substituting real business details): 'The consent disclosure presented to users at the point of opt-in reads as follows: "By checking this box, I agree to receive [message type] text messages from [Business Name] regarding [purpose]. [Frequency]. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for info. SMS opt-in data is never shared with third parties."'
    CRITICAL: If consent checkbox text is provided above (from the A2P Submission Language), quote it verbatim AND ensure all six elements are present — add any missing mandatory elements (especially HELP and no-third-party) to the quoted text in the policy even if the original checkbox text was shorter.
13. HTML ENCODING: Always write "Msg &amp; data rates may apply" — use the HTML entity &amp; for the ampersand so it renders correctly in browsers and in raw page source alike. Never use a bare & in HTML text content.
14. CARRIER LIST: When listing supported US wireless carriers, use ONLY: AT&amp;T, Verizon, T-Mobile, Boost Mobile, MetroPCS, and U.S. Cellular. Do NOT include Sprint — Sprint was fully absorbed into T-Mobile and no longer exists as a separate carrier. Never list Sprint.
15. FREQUENCY CONSISTENCY: The message frequency you state anywhere in a document — in the SMS section, consent disclosures, frequency tables — must exactly match the frequency values from the questionnaire data (Transactional Frequency and Marketing Frequency fields). Use the exact number or range provided. Never substitute "varies" when a specific frequency is given.
16. DUAL CONSENT MECHANISM: The Privacy Policy and Terms must explicitly state that providing a phone number alone does not constitute consent to receive SMS messages. Include language matching this exactly (substituting the real business name): "Providing your phone number on our contact forms, registration pages, or intake forms does not, by itself, constitute consent to receive SMS text messages from [Business Name]. Consent to receive text messages is obtained separately through an affirmative, unchecked checkbox specifically designated for SMS consent at the point of opt-in."
17. NO PURCHASED LISTS STATEMENT: Include this exact sentence verbatim in the SMS/data section: "We do not purchase, rent, or acquire personal information from data brokers, list vendors, or any third-party lead generation sources for use in our SMS messaging program."
18. EXPLICIT PROHIBITION SECTION — STANDALONE SUBSECTION: Within the SMS/Text Messaging section of the Privacy Policy, create a dedicated subsection with this exact title: "Explicit Prohibition on SMS Opt-In Data Sharing". This must be a named subsection (h3 or equivalent), not merely a sentence in another section. It must contain an explicit and unambiguous statement that SMS opt-in consent information — including phone numbers collected via opt-in — is never sold, rented, shared, transferred, or disclosed to any third party, affiliate, or partner under any circumstances, for any purpose.
19. SMS OPT-OUT RECORDS — PERMANENT RETENTION: In the data retention section, include this sentence as a standalone statement: "SMS opt-out records, including the date and time of each STOP request received and processed, are retained permanently to ensure that opted-out mobile numbers are never reactivated without a new affirmative opt-in consent."
20. SMS OPT-IN CONSENT RETENTION — 5 YEARS: State explicitly in the data retention section that SMS opt-in consent records and all supporting documentation are retained for a minimum of five (5) years from the date consent was obtained. Use "five (5) years" — not four years, not "several years."
21. SERVICE TEXTS LANGUAGE: In all consent-facing language — consent disclosure blockquotes, opt-in confirmation message descriptions, checkbox text quoted inside documents — use "service texts" instead of "transactional texts" when referring to non-promotional messages (reminders, confirmations, updates, notifications). "Transactional" is internal carrier/industry terminology; "service texts" is the plain-language equivalent that consumers recognize and that carriers expect to see in consumer-facing consent copy. This rule applies to any language that will appear directly on a form, inside a quoted consent block, or in a message body description shown to end users.
22. JURISDICTION CONSISTENCY: When generating any document containing dispute resolution, arbitration, or governing law clauses, the governing law state, the arbitration venue, and the jurisdiction for non-arbitrable claims must ALL reference the same single state throughout the document. Use ONLY the business's state of incorporation/operation (from the Business State field). Never mix or split jurisdictions — do not set governing law in one state and arbitration venue in a different state. A jurisdiction mismatch is a legal inconsistency that creates liability exposure.
23. OPT-OUT CONFIRMATION MESSAGE CONTENT: When describing the opt-out confirmation message users receive after replying STOP, include this exact sentence explicitly: "The opt-out confirmation message will identify [Business Name] by name and confirm that no further messages will be sent." This closes the loop between the Terms and what the user actually receives, which carriers verify during compliance review.
24. START RE-ENROLLMENT KEYWORD — REQUIRED IN BOTH DOCUMENTS: Immediately after the opt-out description in BOTH the Privacy Policy opt-out section AND the Terms & Conditions SMS opt-out section, add a re-enrollment disclosure using the actual business data from the questionnaire. Use this exact format (substituting real values): "If you wish to re-enroll in our SMS messaging program after opting out, you may text START to [STOP/HELP Number from questionnaire] or re-submit your SMS consent through the opt-in checkbox on our website contact form at [Primary Website URL from questionnaire]." This disclosure is required by CTIA best practices. It must appear in both documents — once in the Privacy Policy opt-out section and once in the Terms & Conditions opt-out section.
25. ADDRESS FORMATTING CONSISTENCY: When including a business address anywhere in a document, choose either "Suite" or "Ste" for the suite/unit designation and use that same format consistently throughout the entire document. Never write "Suite 200" in one place and "Ste 200" in another. Preferred format is the full word "Suite [number]" — not abbreviated.
26. STOP KEYWORD — EXACT PHRASING: The opt-out phrase is ALWAYS "Reply STOP to opt out." — NEVER "Reply STOP to unsubscribe", NEVER "Reply STOP to cancel", NEVER "Reply STOP to stop receiving messages." The word "opt out" is mandatory everywhere it appears in any document. "Unsubscribe" will cause a carrier rejection. This applies to: consent disclosures, opt-out sections, sample messages, and all SMS-related language.
27. RESTRICTED INDUSTRY MESSAGING LANGUAGE: For restricted-industry clients, the language used depends on the USE CASE CLASSIFICATION provided in the prompt:
   - CUSTOMER CARE use case: Use the FOUR hard prohibition sentences (each as a standalone sentence with full business name): "[Business Name] does not send promotional, advertising, or marketing SMS messages of any kind." / "[Business Name] does not engage in SMS-based solicitation of prospective clients or customers." / "[Business Name] does not use text messaging to present offers, rate quotes, discounts, or product comparisons." / "[Business Name] does not send batch, broadcast, or mass SMS messages of any kind."
   - CONVERSATIONAL or MIXED USE case: Do NOT use the four hard prohibition sentences — they deny behavior the reviewer can see is happening (inquiry follow-up). Instead use this accurate framing: "[Business Name] does not send unsolicited promotional or marketing SMS messages. SMS communications are limited to responses to user inquiries, conversational follow-up, and transactional messages related to [specific service area]. Messages are not sent to purchased lists or cold contacts and do not include promotional or unsolicited marketing content."
   The industry restriction section in the prompt will specify which approach to use. Follow it exactly.
28. RESTRICTED INDUSTRY MESSAGE TEST: For restricted-industry documents, apply this test to every described message type:
   - For CUSTOMER CARE use case — strict transactional test: Q1: Has the recipient already initiated the transaction? (YES) Q2: Does it persuade a new action? (NO) Q3: Would it make sense as a response? (YES). Only YES/NO/YES messages pass.
   - For CONVERSATIONAL or MIXED USE case — expanded test: Messages are allowed if the recipient INITIATED CONTACT (submitted a form, sent an inquiry, requested information) OR has an active account/file/service. Conversational follow-up on an inquiry IS allowed. What is NOT allowed: cold outreach to people who didn't reach out, promotional offers, rate quote blasts, or marketing campaigns.
29. CONSENT NOT A CONDITION: Include this as an explicit standalone statement in the SMS section: "Consent to receive text messages is not required as a condition of purchasing any goods or services."
30. PROHIBITION SURVIVES RESTRUCTURING: The no-sharing prohibition for SMS opt-in data must explicitly survive any corporate merger, acquisition, or organizational restructuring. Include language such as: "This prohibition on sharing SMS opt-in data shall survive any corporate restructuring, merger, acquisition, or change in ownership."
31. CROSS-DOCUMENT CONSENT TEXT — CHARACTER-FOR-CHARACTER MATCH: When consent checkbox texts are provided (from the A2P Submission Language), every document that quotes them MUST use the EXACT SAME wording, character for character. The Privacy Policy "Consent Disclosure" blockquote, the Terms & Conditions consent disclosure section, and the opt-in description field must all quote the identical text. Do NOT paraphrase, reorder words, add/remove commas, change capitalization, or substitute synonyms. If the checkbox says "service texts" do not write "service messages." If it says "promotional texts" do not write "marketing messages." Copy the text verbatim. A compliance reviewer will diff the consent language across all three documents — any discrepancy, no matter how small, is flagged as an inconsistency.
32. VERBATIM SECTIONS — COPY, DO NOT REWRITE: When the prompt provides sections labeled "VERBATIM" or "COPY EXACTLY", you MUST reproduce them character-for-character in the appropriate location in the document. Do not rewrite, paraphrase, "improve", or edit them in any way. They have already been reviewed for compliance. Your only job is to place them correctly in the document structure. This includes consent blockquotes, opt-out confirmation text, START re-enrollment text, carrier lists, and any other text explicitly marked as verbatim. A compliance reviewer will programmatically diff these sections across documents — any difference causes rejection.

FORMAT REQUIREMENTS:
- Use clean semantic HTML: h1 for the document title, h2 for major sections, h3 for subsections, p for paragraphs, ul/ol/li for lists
- Include proper section numbering in headings (e.g. "1. Information We Collect")
- Write every section completely — this is a real legal document, not a template
- CRITICAL: Every element MUST have inline margin styles for site-builder compatibility. Many website builders strip default CSS margins, so spacing must be baked into the HTML:
  - <h1 style="margin-top: 0; margin-bottom: 0.5em;">
  - <h2 style="margin-top: 1.5em; margin-bottom: 0.5em;">
  - <h3 style="margin-top: 1.2em; margin-bottom: 0.4em;">
  - <p style="margin-top: 0; margin-bottom: 1em;">
  - <ul style="margin-top: 0; margin-bottom: 1em; padding-left: 1.5em;"> and <ol style="margin-top: 0; margin-bottom: 1em; padding-left: 1.5em;">
  - <li style="margin-bottom: 0.3em;">
  - <blockquote style="margin: 1em 0; padding-left: 1em; border-left: 3px solid #d1d5db;">
- CRITICAL: Do NOT add any other styles beyond the margin/padding listed above — no font-family, font-size, color, max-width, width, or background styles
- CRITICAL: Do NOT wrap the document in a <div> with layout styles
- CRITICAL: Do NOT include any <style> tags
- Output the document content directly — start with <h1> for the title, then proceed with sections

Do NOT include any markdown formatting. Output ONLY valid HTML content (no <html>, <head>, <body>, or <style> tags — just the document content starting with <h1>).`;

function buildWebsiteSection(_answers: Record<string, string>, websiteContent: string): string {
  if (!websiteContent) return "";
  return `
WEBSITE CONTENT (fetched from the business's listed URLs):
The following is text content scraped from the business's website(s). Use this to accurately understand their business, services, and branding tone. Write documents that are specific and accurate to this business — do not guess or infer from domain names:

${websiteContent}
`;
}

const INDUSTRY_RULES: Record<string, { prohibited: string[]; allowed: string[]; regulatoryNote: string }> = {
  "Mortgage Lending or Brokerage": {
    prohibited: [
      "Rate quote blasts (e.g., '30-year fixed at 6.5% — call us today')",
      "Pre-approval solicitations to cold or purchased leads",
      "Refinance campaign messages (e.g., 'Now is a great time to refinance')",
      "Cash-out equity promotions",
      "Product comparisons sent to unconverted leads",
      "Urgency-based rate lock offers",
      "Loan product promotions or limited-time offer announcements",
    ],
    allowed: [
      "Application receipt confirmation sent immediately after form submission",
      "Rate lock confirmation tied to a specific borrower's active file",
      "Document checklist requests for open loan files",
      "Appraisal scheduling notifications",
      "Underwriting status updates",
      "Closing date confirmations",
      "Funding disbursement notifications",
      "Payment due date reminders for active loan agreements",
      "Direct responses to borrower-initiated inquiries",
    ],
    regulatoryNote: "Governed by RESPA, TILA, Regulation Z, and state mortgage lending statutes restricting unsolicited financial solicitations via SMS.",
  },
  "Banking or Credit Union": {
    prohibited: [
      "New account sign-up promotions",
      "Credit card offer solicitations",
      "Loan product advertisements",
      "Promotional interest rate offers",
      "Rewards program upsell messages",
      "Cross-sell messages for additional banking products",
    ],
    allowed: [
      "Account balance alerts triggered by account activity",
      "Fraud detection alerts and suspicious activity notifications",
      "Transaction confirmation messages",
      "Low balance warnings",
      "Payment due date reminders",
      "Wire transfer confirmations",
      "Password reset and security verification codes (OTP)",
      "Deposit confirmation notifications",
    ],
    regulatoryNote: "Governed by FDIC/NCUA regulations, Gramm-Leach-Bliley Act, and applicable state banking laws restricting unsolicited promotional consumer contact.",
  },
  "Insurance Company": {
    prohibited: [
      "Policy solicitations to cold leads",
      "Premium rate promotions (e.g., 'Switch and save 20%')",
      "Coverage upsell messages to existing policyholders",
      "Open enrollment campaign blasts",
      "Cross-sell messages for additional insurance products",
    ],
    allowed: [
      "Policy renewal reminders tied to a specific policyholder's expiring policy",
      "Payment due date reminders",
      "Claim status updates for active claims",
      "Claim filing confirmations",
      "Appointment confirmations for adjusters",
      "Coverage change confirmations initiated by the policyholder",
      "Authentication and verification codes",
    ],
    regulatoryNote: "Governed by state insurance department regulations and NAIC guidelines restricting unsolicited insurance solicitations.",
  },
  "Investment Advisory or Securities": {
    prohibited: [
      "Investment product solicitations",
      "Stock or fund recommendations sent via SMS",
      "Portfolio performance teasers designed to upsell services",
      "Event invitations for sales-oriented seminars",
      "Cold outreach to prospect lists",
      "Any message that could be construed as investment advice or a securities recommendation",
    ],
    allowed: [
      "Trade confirmation notifications for existing clients",
      "Account statement availability alerts",
      "Meeting or review appointment confirmations",
      "Required regulatory disclosures triggered by account activity",
      "Password reset and authentication codes",
      "Responses to client-initiated inquiries",
    ],
    regulatoryNote: "Governed by SEC, FINRA, and Investment Advisers Act rules. Any message that could be construed as investment advice or a securities recommendation via SMS is prohibited.",
  },
  "Healthcare or Medical Services": {
    prohibited: [
      "New patient solicitation campaigns",
      "Promotional messaging for elective procedures (e.g., 'Ask us about our cosmetic services')",
      "Wellness product upsell messages",
      "Referral incentive solicitations",
      "Health screening event promotions sent to general lists",
      "Any message marketing a specific service to patients who haven't inquired about it",
    ],
    allowed: [
      "Appointment reminders and confirmations",
      "Appointment rescheduling notifications",
      "Prescription ready notifications",
      "Lab result availability alerts (without disclosing PHI in the message body)",
      "Post-appointment follow-up care instructions",
      "Billing statements and payment due reminders",
      "Referral appointment confirmations",
      "Responses to patient-initiated inquiries",
    ],
    regulatoryNote: "Governed by HIPAA and HITECH Act. All messages must be HIPAA-compliant. PHI must never be included in SMS message bodies. Transactional messages must be triggered by a specific patient action or clinical event.",
  },
  "Debt Consolidation": {
    prohibited: [
      "Cold outreach campaigns",
      "Savings-based promotional messaging (e.g., 'Consolidate and cut your payments in half')",
      "Urgency-based solicitations to purchased or cold leads",
      "Promotional program comparisons",
    ],
    allowed: [
      "Program enrollment confirmations for active clients",
      "Payment schedule notifications for enrolled clients",
      "Account status updates for clients with active plans",
      "Creditor communication updates tied to active enrollment",
    ],
    regulatoryNote: "Heavily scrutinized category similar to credit repair. Governed by FTC regulations on debt relief services. Requires strong documentation of opt-in consent and is frequently rejected without transactional-only framing.",
  },
  "Credit Repair Services": {
    prohibited: [
      "Solicitation campaigns (e.g., 'We can remove negative items from your credit report')",
      "Before-and-after score promotional messaging",
      "Urgency-based outreach (e.g., 'Your credit score is hurting you — act now')",
      "Cold lead nurture sequences",
    ],
    allowed: [
      "Dispute status updates for clients with an active service engagement",
      "Document request notifications tied to an open file",
      "Progress updates tied to an active service agreement",
    ],
    regulatoryNote: "Governed by the Credit Repair Organizations Act (CROA) and FTC rules. This category is frequently rejected by carriers even for transactional campaigns and requires exceptional documentation of explicit written opt-in consent and active client relationships.",
  },
  "Law Firm or Legal Services": {
    prohibited: [
      "Solicitation of new clients via SMS (violates state bar advertising rules in most jurisdictions)",
      "Case type promotional campaigns (e.g., 'Were you in an accident? You may be entitled to compensation')",
      "Mass outreach to purchased leads",
      "Settlement advertising",
      "Service area expansion announcements sent to cold contacts",
    ],
    allowed: [
      "Case status updates for existing clients",
      "Court date reminders for active clients",
      "Document request notifications tied to an open matter",
      "Appointment confirmations for client-initiated consultations",
      "Billing reminders for existing clients",
      "Authentication and verification codes",
    ],
    regulatoryNote: "Governed by state bar Model Rules of Professional Conduct (Rule 7.3 prohibiting direct solicitation). SMS solicitation of prospective clients is prohibited in virtually all U.S. jurisdictions, layered on top of carrier restrictions.",
  },
  "Political Campaign": {
    prohibited: [
      "Broadcast promotional political messaging via A2P 10DLC without proper special-use registration",
      "Mass unsolicited campaign blasts to general lists",
      "Peer-to-peer political texting via A2P platforms without P2P registration",
    ],
    allowed: [
      "Volunteer shift confirmations",
      "Event logistics for confirmed attendees",
      "Donation receipt confirmations",
      "RSVP confirmations for registered event attendees",
    ],
    regulatoryNote: "Political campaigns must register under a dedicated Political use case with additional carrier vetting. P2P political texting operates under different rules than A2P 10DLC. Broadcast promotional political messaging via 10DLC is heavily restricted without proper P2P platform registration.",
  },
};

function buildIndustryRestrictionSection(answers: Record<string, string>): string {
  if (!isRestrictedIndustry(answers)) return "";
  const restricted = getSelectedRestricted(answers);
  const legalName = answers.legal_business_name || "This business";
  const useCase = getUseCaseLabel(answers);
  const isCustomerCareOnly = useCase === "Customer Care";

  const perIndustryRules = restricted.map((industry) => {
    const rules = INDUSTRY_RULES[industry];
    if (!rules) return `\n${industry}: Restricted to transactional messages only. No promotional messaging permitted.`;
    return `
${industry.toUpperCase()}:
  Regulatory note: ${rules.regulatoryNote}
  PROHIBITED messages (never include, never reference):
    ${rules.prohibited.map((p) => `• ${p}`).join("\n    ")}
  ALLOWED messages (${isCustomerCareOnly ? "transactional only, triggered by user action or account event" : "transactional + conversational follow-up on user-initiated inquiries"}):
    ${rules.allowed.map((a) => `• ${a}`).join("\n    ")}`;
  }).join("\n");

  // Customer Care only: use the hard 4 prohibition sentences (purely servicing existing customers)
  if (isCustomerCareOnly) {
    return `
INDUSTRY RESTRICTION — CRITICAL — READ BEFORE GENERATING:
This business operates in a regulated industry: ${restricted.join(", ")}.
Use case is CUSTOMER CARE — this business ONLY messages existing customers with active accounts/files/services.

FOUR MANDATORY DECLARATIVE PROHIBITION SENTENCES — INCLUDE VERBATIM IN THE SMS SECTION:
These four sentences must appear as standalone statements in the SMS/Text Messaging policy section of every generated document:
  "${legalName} does not send promotional, advertising, or marketing SMS messages of any kind."
  "${legalName} does not engage in SMS-based solicitation of prospective clients or customers."
  "${legalName} does not use text messaging to present offers, rate quotes, discounts, or product comparisons."
  "${legalName} does not send batch, broadcast, or mass SMS messages of any kind."

UNIVERSAL RULES:
1. The SMS program is limited EXCLUSIVELY to transactional messages triggered by specific user actions or account events.
2. The marketing_use_case and marketing_message_types fields below should be treated as N/A.
3. Every message identifies the business by name, includes STOP opt-out language, and includes "Msg &amp; data rates may apply."
4. SMS opt-in consent cannot be shared with or transferred to any third party.
5. Any message with a promotional call to action, discount, rate quote, or language designed to persuade rather than inform is prohibited.
6. Any message sent to a cold contact who did not affirmatively opt in is prohibited.

SPECIFIC RULES BY INDUSTRY:${perIndustryRules}

Write the SMS/messaging sections of all documents to strictly reflect these restrictions.
`;
  }

  // Conversational or Mixed Use: use softer, accurate language that allows inquiry follow-up
  return `
INDUSTRY RESTRICTION — REGULATED INDUSTRY WITH CONVERSATIONAL/MIXED MESSAGING:
This business operates in a regulated industry: ${restricted.join(", ")}.
Use case is ${useCase} — this business responds to inbound inquiries AND/OR services existing clients. It does NOT send cold outreach, promotional blasts, or unsolicited marketing.

MESSAGING LANGUAGE — USE THIS POSITIONING (not the hard prohibition sentences):
Instead of "does not send promotional, advertising, or marketing SMS messages of any kind", use this accurate framing:
  "${legalName} does not send unsolicited promotional or marketing SMS messages. SMS communications are limited to responses to user inquiries, conversational follow-up, and transactional messages related to ${restricted.map(i => {
    if (i.includes("Mortgage") || i.includes("Banking")) return "loan applications and active files";
    if (i.includes("Insurance")) return "policy inquiries and active policies";
    if (i.includes("Healthcare")) return "patient inquiries and appointments";
    if (i.includes("Investment")) return "client inquiries and active accounts";
    if (i.includes("Law")) return "case inquiries and active matters";
    return "active client files and inquiries";
  }).join(", ")}."

WHY THIS MATTERS: The old "does not send promotional messages of ANY kind" language gets rejected when the reviewer sees that the business clearly follows up on form submissions — that's conversational messaging, and denying it creates a mismatch. The new language is honest: no cold outreach, no promos, but YES to responding to inquiries.

WHAT IS ALLOWED:
✓ Responding to inquiries submitted through the website
✓ Asking qualification questions after someone submits a form
✓ Following up on submitted applications/requests
✓ Sending application/case/file status updates
✓ Document and appointment reminders for active clients
✓ Direct responses to client-initiated questions

WHAT IS STILL PROHIBITED:
✗ Cold outreach to purchased lists or contacts who didn't inquire
✗ Promotional rate quotes, offers, or "get approved today" messages
✗ Unsolicited marketing blasts or re-engagement campaigns
✗ Broadcast messages to general lists
✗ Any message designed to persuade someone who didn't already reach out

RULES:
1. The marketing_use_case and marketing_message_types fields should be treated as N/A — no promotional SMS.
2. Every message identifies the business by name, includes STOP opt-out language, and includes "Msg &amp; data rates may apply."
3. SMS opt-in consent cannot be shared with or transferred to any third party.
4. Messages are ONLY sent to people who submitted an inquiry or have an active file/account.
5. Sample messages must reflect REAL behavior: inquiry follow-up + transactional updates. NOT promotional.

SPECIFIC RULES BY INDUSTRY:${perIndustryRules}

Write the SMS/messaging sections to honestly reflect this business's messaging: inbound inquiry follow-up + transactional servicing. Do NOT deny that the business responds to leads — that's exactly what it does, and the reviewer knows it.
`;
}

function buildUseCaseSection(answers: Record<string, string>): string {
  const useCase = getUseCaseLabel(answers);
  const firstMsgExample = answers.first_message_example || "";
  const sampleMessages = answers.sample_messages || "";

  let rules = "";

  if (useCase === "Customer Care") {
    rules = `USE CASE RULES — CUSTOMER CARE (POST-RELATIONSHIP ONLY):
- This business ONLY messages people who are ALREADY customers with an active account, contract, or service.
- ALL messaging language must describe a post-relationship maintenance program — updates, reminders, confirmations, status changes.
- NEVER use language that implies lead follow-up, outreach, or initial contact: no "following up", "reaching out", "connecting with", "thanks for your interest".
- Sample messages must ONLY be responses to existing service states (active account, open file, scheduled appointment, completed transaction).
- Consent language should reference "service notifications", "account updates", and "appointment reminders" — NOT "responses to inquiries" or "follow-up communications".
- The use_case_description must establish that recipients are EXISTING customers with DEFINED service states (account, contract, subscription, active file) BEFORE messaging begins.
- A form submission or inquiry does NOT constitute a customer relationship. Do not describe the program as if it starts at the lead stage.
- If the first message is a response to a form submission, that is NOT Customer Care — it is Conversational. Customer Care messages respond to SERVICE events, not INTEREST events.`;
  } else if (useCase === "Conversational Messaging") {
    rules = `USE CASE RULES — CONVERSATIONAL MESSAGING (PRE-RELATIONSHIP INTERACTION):
- This business messages people who have INITIATED contact (form submission, inquiry, request) but do NOT yet have an active customer relationship.
- Messaging is interactive and two-way — the business asks questions, gathers information, qualifies, and guides.
- Sample messages must be questions or direct responses to inquiries — NOT broadcast updates or automated blasts.
- Tone must be conversational and personal, not automated or templated.
- The use_case_description must establish: (1) user initiated contact first, (2) messaging is interactive back-and-forth, (3) no formal customer relationship yet, (4) purpose is to understand, qualify, and guide.
- Consent language should reference "responses to your inquiry", "follow-up communications", and "information you requested".
- Do NOT describe the program as "customer care" or "account notifications" — the recipients are leads, not customers.
- Messages that feel like automation blasts (generic, pushy, no personalization) will be rejected even with valid opt-in.
- Language must NOT cross into persuasion. "We have great options for you" is marketing, not conversational. Stick to information exchange.`;
  } else if (useCase === "Marketing") {
    rules = `USE CASE RULES — MARKETING (PROMOTIONAL MESSAGING):
- This business sends promotional, persuasion, or re-engagement messages to drive behavior.
- Full marketing consent flow required — dual checkbox (marketing + transactional/service).
- Sample messages can include offers, promotions, calls to action, new product announcements, and re-engagement.
- The use_case_description must be transparent about promotional intent — do not disguise marketing as "updates" or "notifications".
- Strongest SHAFT compliance language needed (no content related to sex, hate, alcohol, firearms, tobacco/drugs).
- Consent language must explicitly reference "promotional text messages", "special offers", and "marketing communications".
- Include specific frequency caps and honor them strictly — marketing campaigns get extra scrutiny on frequency claims.`;
  } else {
    // Mixed Use
    rules = `USE CASE RULES — MIXED USE (BOTH LEAD INTERACTION AND CUSTOMER SERVICING):
- This business BOTH interacts with new leads (pre-relationship) AND services existing customers (post-relationship).
- This is the most common use case for real businesses — do NOT try to force it into a single category.
- Documents must describe BOTH programs clearly:
  (1) Pre-sale: responding to inquiries, qualifying leads, answering questions
  (2) Post-sale: appointment reminders, status updates, payment notifications, account alerts
- Sample messages MUST include examples from BOTH sides — one conversational/lead message AND one transactional/service message. If samples only show one side, the reviewer will flag a mismatch.
- The use_case_description must explicitly describe both programs and the transition between them.
- Consent checkboxes need to cover both program types (marketing/promotional + service/transactional).
- Privacy Policy and Terms must address both relationship stages — lead interaction AND customer servicing.
- Do NOT deny that lead follow-up happens. If the business follows up with leads AND services customers, the documents must reflect both. Denying reality (e.g., "we do not send outreach messages") when the system clearly does follow up will cause rejection due to inconsistency.
- Legal docs that say "we only send transactional messages" when the business also follows up with leads = instant rejection.`;
  }

  return `
A2P USE CASE CLASSIFICATION: ${useCase}
${firstMsgExample ? `FIRST MESSAGE EXAMPLE (provided by the business): "${firstMsgExample}"` : ""}
${sampleMessages ? `SAMPLE MESSAGES (provided by the business):\n${sampleMessages}` : ""}

${rules}

CRITICAL — USE CASE CONSISTENCY:
Every element of every document must tell the same story. The reviewer's decision tree:
1. Why does the first message exist? (to respond? to update? to sell?)
2. What stage is the user in? (stranger? lead? customer?)
3. Who caused the message to happen? (the user? the business? the system?)
If the answer to these questions doesn't match the use case classification above, the campaign WILL be rejected.
`;
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrivacyPolicyReferenceSection(privacyContent: string | null): string {
  if (!privacyContent) return "";

  // Extract specific verbatim sections for mechanical consistency
  const anchors = extractConsistencyAnchors(privacyContent);
  const verbatimSection = buildVerbatimAnchorsSection(anchors);

  const text = stripHtmlToText(privacyContent);
  const truncated = text.length > 60000 ? text.substring(0, 60000) + "... [truncated for length]" : text;
  return `
PREVIOUSLY GENERATED PRIVACY POLICY — CROSS-DOCUMENT CONSISTENCY REQUIRED:
The Privacy Policy for this business has already been generated. The Terms & Conditions MUST be consistent with it on every point where the documents overlap. Specifically:
  - Data retention periods must match exactly (do not state a different number of years for SMS opt-in records or any other data category)
  - Governing law and jurisdiction must match the Privacy Policy's stated jurisdiction
  - Any consent language, opt-out procedures, and STOP/HELP responses described must be consistent
  - When cross-referencing the Privacy Policy (e.g., for data retention), use the same section names or describe the same terms
  - Do NOT contradict any policy statement from the Privacy Policy

Privacy Policy content (use for reference and consistency — do not copy it verbatim into the Terms):
${truncated}
${verbatimSection}`;
}

interface ConsentCheckboxes {
  marketing?: string | null;
  transactional?: string | null;
  optInMessage?: string | null;
  formSecondaryText?: string | null;
}

function buildConsentAnchorSection(checkboxes: ConsentCheckboxes | null, restricted: boolean): string {
  if (!checkboxes) {
    return `
CONSENT LANGUAGE NOTE:
No A2P Submission Language has been generated yet for this project. Write representative consent disclosure language in the "Consent Disclosure" blockquote consistent with the business information above. The quoted block MUST include all mandatory elements: message type, frequency, "Msg & data rates may apply.", "Reply STOP to opt out.", "Reply HELP for info.", and "SMS opt-in data is never shared with third parties." — all six inside the quoted block.
`;
  }

  const marketingLine = restricted
    ? (checkboxes.marketing
      ? `Marketing consent checkbox: "${checkboxes.marketing}"`
      : "Marketing consent checkbox: Not applicable — restricted industry, no promotional messaging.")
    : checkboxes.marketing
    ? `Marketing consent checkbox: "${checkboxes.marketing}"`
    : "";

  const transactionalLine = checkboxes.transactional
    ? `Transactional consent checkbox: "${checkboxes.transactional}"`
    : "";

  return `
CONSENT CHECKBOX TEXT — ALREADY GENERATED FOR THIS BUSINESS:
The following consent checkbox texts are the words that appear on this business's opt-in forms. Use these as the basis for the "Consent Disclosure" blockquote in the Privacy Policy SMS section.

${marketingLine}
${transactionalLine}

CRITICAL: When quoting these texts in the Privacy Policy "Consent Disclosure" block, you MUST ensure ALL mandatory elements are present inside the quoted block — even if the checkbox text above is shorter than required:
  - "Reply STOP to opt out." — must be inside the quoted block
  - "Reply HELP for info." — must be inside the quoted block (add it if missing from the checkbox text above)
  - "SMS opt-in data is never shared with third parties." — must be inside the quoted block (add it if missing from the checkbox text above)
Augment the quoted text as needed to include all three. Do not move them to surrounding prose.

VERBATIM CONSISTENCY REQUIREMENT: When quoting the consent checkbox text in this document, use the EXACT text provided above — character for character. Do NOT paraphrase, reorder, change capitalization, swap synonyms, or alter punctuation. A compliance reviewer will compare the consent language in this document against the submission language and the other generated document. Any difference — even a single changed word — is flagged as an inconsistency and can cause rejection.
${checkboxes.optInMessage ? `
VERBATIM — OPT-IN CONFIRMATION MESSAGE (from Submission Language):
"${checkboxes.optInMessage}"
When describing the opt-in confirmation message in this document, use the EXACT text above. Do not rewrite it.` : ""}
${checkboxes.formSecondaryText ? `
VERBATIM — FORM SECONDARY TEXT (from Submission Language):
"${checkboxes.formSecondaryText}"
When referencing the form secondary text or sub-checkbox disclosure, use the EXACT text above.` : ""}
`;
}

interface ConsistencyAnchors {
  consentBlockquote: string | null;
  optOutConfirmation: string | null;
  startReenrollment: string | null;
  carrierList: string | null;
  governingLawState: string | null;
}

function extractConsistencyAnchors(ppHtml: string): ConsistencyAnchors {
  const anchors: ConsistencyAnchors = {
    consentBlockquote: null,
    optOutConfirmation: null,
    startReenrollment: null,
    carrierList: null,
    governingLawState: null,
  };

  // Extract blockquote content (consent disclosure)
  const bqMatch = ppHtml.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
  if (bqMatch) {
    anchors.consentBlockquote = stripHtmlToText(bqMatch[1]);
  }

  const text = stripHtmlToText(ppHtml);

  // Extract opt-out confirmation sentence
  const optOutMatch = text.match(/(The opt-out confirmation message will identify[^.]+\.)/i);
  if (optOutMatch) {
    anchors.optOutConfirmation = optOutMatch[1].trim();
  }

  // Extract START re-enrollment sentence
  const startMatch = text.match(/(If you wish to re-enroll[^.]+\.)/i);
  if (startMatch) {
    anchors.startReenrollment = startMatch[1].trim();
  }

  // Extract carrier list sentence
  const carrierMatch = text.match(/((?:Supported|Participating|Major)[^.]*(?:AT&T|AT&amp;T)[^.]*\.)/i);
  if (carrierMatch) {
    anchors.carrierList = carrierMatch[1].trim();
  }

  // Extract governing law state
  const lawMatch = text.match(/governed by.*?laws of.*?(?:the )?(?:State of )?(\w+(?:\s\w+)?)/i);
  if (lawMatch) {
    anchors.governingLawState = lawMatch[1].trim();
  }

  return anchors;
}

function buildVerbatimAnchorsSection(anchors: ConsistencyAnchors): string {
  const sections: string[] = [];

  if (anchors.consentBlockquote) {
    sections.push(`1. CONSENT DISCLOSURE BLOCKQUOTE (VERBATIM — COPY EXACTLY):
"${anchors.consentBlockquote}"`);
  }

  if (anchors.optOutConfirmation) {
    sections.push(`2. OPT-OUT CONFIRMATION TEXT (VERBATIM — COPY EXACTLY):
"${anchors.optOutConfirmation}"`);
  }

  if (anchors.startReenrollment) {
    sections.push(`3. START RE-ENROLLMENT DISCLOSURE (VERBATIM — COPY EXACTLY):
"${anchors.startReenrollment}"`);
  }

  if (anchors.carrierList) {
    sections.push(`4. CARRIER LIST (VERBATIM — COPY EXACTLY):
"${anchors.carrierList}"`);
  }

  if (anchors.governingLawState) {
    sections.push(`5. GOVERNING LAW STATE: ${anchors.governingLawState}
All governing law, arbitration venue, and jurisdiction references must use this state.`);
  }

  if (sections.length === 0) return "";

  return `
VERBATIM SECTIONS FROM PRIVACY POLICY — COPY EXACTLY INTO TERMS & CONDITIONS:
The following sections were extracted from the already-generated Privacy Policy. They MUST appear character-for-character identical in the Terms & Conditions. Do NOT rewrite, paraphrase, or "improve" them. Place them in the correct location in the document structure.

${sections.join("\n\n")}
`;
}

async function buildAnalysisHistorySection(supabase: ReturnType<typeof createServiceClient>, projectId: string): Promise<string> {
  const { data } = await supabase
    .from("analysis_history")
    .select("issues, summary, overall_risk, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return "";

  const latest = data[0];
  const issues = latest.issues as Array<{
    severity: string;
    title: string;
    description: string;
    affected_documents: string[];
    recommendation: string;
  }>;

  if (!issues || issues.length === 0) return "";

  const issueLines = issues.map((issue, i) =>
    `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}
   Problem: ${issue.description}
   Affects: ${issue.affected_documents.join(", ")}
   Fix: ${issue.recommendation}`
  ).join("\n\n");

  return `
PREVIOUS COMPLIANCE ISSUES — DO NOT REPEAT THESE MISTAKES:
A compliance analysis was run on the previously generated documents and found the following issues. You are now regenerating to fix these. You MUST address every issue listed below. Do NOT introduce the same errors again.

Previous analysis summary: ${latest.summary}
Previous risk level: ${latest.overall_risk}

Issues found (fix ALL of these):
${issueLines}

CRITICAL: The above issues are the SPECIFIC reasons this document is being regenerated. Address every single one. If an issue says text was inconsistent, use the EXACT verbatim text provided elsewhere in this prompt. If an issue says something was missing, include it. If an issue says something was wrong, correct it.
`;
}

function buildPrivacyPolicyPrompt(answers: Record<string, string>, websiteContent: string, today: string, consentCheckboxes: ConsentCheckboxes | null = null, existingPolicyContent: string = "", analysisHistory: string = ""): string {
  const restricted = isRestrictedIndustry(answers);
  return `Generate a comprehensive Privacy Policy for A2P 10DLC compliance based on the following business information:

TODAY'S DATE: ${today} — use this as the "Last Updated" and "Effective Date" in the document.

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
- Business Description: ${answers.business_description || "N/A"}
- Business Category: ${answers.business_category || "N/A"}
- Industry Classification: ${answers.industry_type || "N/A"}
- Business Address: ${answers.business_address || "N/A"}
- Business Phone: ${answers.business_phone || "N/A"}
- Business Email: ${answers.business_email || "N/A"}
- Website: ${answers.primary_website || "N/A"}

SMS CAMPAIGN USE CASES:
- Marketing Use Case: ${restricted ? "N/A — Restricted industry. This business does not send promotional or marketing SMS messages." : (answers.marketing_use_case || "N/A")}
- Marketing Message Types: ${restricted ? "None — transactional messages only per industry regulations" : (answers.marketing_message_types || "N/A")}
- Marketing Frequency: ${restricted ? "N/A — no marketing messages sent" : (answers.marketing_frequency || "N/A")}
- Transactional Use Case: ${answers.transactional_use_case || "N/A"}
- Transactional Message Types: ${answers.transactional_message_types || "N/A"}
- Transactional Frequency: ${answers.transactional_frequency || "N/A"}

OPT-IN DETAILS:
- Opt-in Locations: ${answers.optin_locations || "N/A"}
- Phone Field Required: ${answers.phone_field_required || "N/A"}
- Pre-checked Consent Boxes: ${answers.prechecked_consent || "N/A"}
- Policy Links Visible: ${answers.policy_links_visible || "N/A"}

SUPPORT & OPT-OUT:
- STOP/HELP Number: ${answers.stop_help_number || "N/A"}
- Support Email: ${answers.support_email || "N/A"}
- Toll-free Number: ${answers.tollfree_number || "N/A"}

DATA SHARING & THIRD PARTIES:
- Shares SMS Opt-in Data: ${answers.shares_optin_data || "N/A"}
- Passes Leads to Third Parties: ${answers.passes_leads || "N/A"}
- Lead Passing Tied to SMS: ${answers.lead_passing_tied_to_sms || "N/A"}
- Uses Subcontractors: ${answers.uses_subcontractors || "N/A"}
- Subcontractor Details: ${answers.subcontractor_details || "N/A"}
- Uses Affiliate Tracking: ${answers.uses_affiliate_tracking || "N/A"}

COMPLIANCE:
- Collects Data Under 13: ${answers.collects_under_13 || "N/A"}
- Operates in California: ${answers.operates_in_california || "N/A"}
- Business State: ${answers.business_state || "N/A"}

PLATFORM:
- Primary SMS Platform: ${answers.primary_sms_platform || "N/A"}
- Additional Platforms: ${answers.additional_sms_platforms || "N/A"}
- Additional Platform Details: ${answers.additional_platform_details || "N/A"}
${buildWebsiteSection(answers, websiteContent)}
${existingPolicyContent ? `
EXISTING PRIVACY POLICY TO UPDATE:
The user has an existing privacy policy they want updated for A2P compliance. Keep their existing language and structure where appropriate, but ADD all the required SMS/messaging sections and A2P-specific language. Here is their current policy (fetched from ${answers.existing_privacy_policy_url || "their website"}):

${existingPolicyContent}

Update the above policy to include all A2P requirements listed below. Keep existing sections that are still relevant.
` : ""}
${buildUseCaseSection(answers)}${buildIndustryRestrictionSection(answers)}${buildConsentAnchorSection(consentCheckboxes, restricted)}${analysisHistory}
Generate the COMPLETE privacy policy in HTML format. Write EVERY section fully — no placeholders, no shortcuts, no "[insert here]" markers. This must be ready to copy-paste onto a website immediately.

CRITICAL A2P requirements to include:
1. Introduction identifying the business and scope
2. Information collected (personal data, device data, SMS opt-in data)
3. How information is used (including SMS messaging purposes)
4. SMS/Text Messaging section — MUST include:
   - Clear description of the messaging program
   - Explicit statement that SMS opt-in consent is NOT shared with or sold to third parties
   - How to opt in (describe the consent mechanism)
   - How to opt out (reply STOP)
   - How to get help (reply HELP or contact support)
   - Message frequency disclosure
   - "Message and data rates may apply" statement
   - Supported carriers disclaimer
5. Data sharing and third-party disclosure
6. Data security measures
7. Data retention practices
8. User rights (access, correction, deletion)
9. Children's privacy (COPPA compliance)
10. California privacy rights (if applicable)
11. Changes to the policy
12. Contact information`;
}

function buildTermsPrompt(answers: Record<string, string>, websiteContent: string, today: string, consentCheckboxes: ConsentCheckboxes | null = null, privacyPolicyContent: string | null = null, existingTermsContent: string = "", analysisHistory: string = ""): string {
  const restricted = isRestrictedIndustry(answers);
  return `Generate comprehensive Terms & Conditions for A2P 10DLC compliance based on the following information:

TODAY'S DATE: ${today} — use this as the "Last Updated" and "Effective Date" in the document.

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
- Business Description: ${answers.business_description || "N/A"}
- Business Category: ${answers.business_category || "N/A"}
- Industry Classification: ${answers.industry_type || "N/A"}
- Business Address: ${answers.business_address || "N/A"}
- Business Phone: ${answers.business_phone || "N/A"}
- Business Email: ${answers.business_email || "N/A"}
- Website: ${answers.primary_website || "N/A"}

SMS CAMPAIGN USE CASES:
- Marketing Use Case: ${restricted ? "N/A — Restricted industry. This business does not send promotional or marketing SMS messages." : (answers.marketing_use_case || "N/A")}
- Marketing Message Types: ${restricted ? "None — transactional messages only per industry regulations" : (answers.marketing_message_types || "N/A")}
- Marketing Frequency: ${restricted ? "N/A — no marketing messages sent" : (answers.marketing_frequency || "N/A")}
- Transactional Use Case: ${answers.transactional_use_case || "N/A"}
- Transactional Message Types: ${answers.transactional_message_types || "N/A"}
- Transactional Frequency: ${answers.transactional_frequency || "N/A"}

OPT-IN & OPT-OUT:
- Opt-in Locations: ${answers.optin_locations || "N/A"}
- STOP/HELP Number: ${answers.stop_help_number || "N/A"}
- Support Email: ${answers.support_email || "N/A"}

DATA SHARING:
- Shares SMS Opt-in Data: ${answers.shares_optin_data || "N/A"}
- Uses Subcontractors: ${answers.uses_subcontractors || "N/A"}
- Subcontractor Details: ${answers.subcontractor_details || "N/A"}

COMPLIANCE:
- Business State: ${answers.business_state || "N/A"}
- Primary SMS Platform: ${answers.primary_sms_platform || "N/A"}

CONFIRMATIONS:
- Two Separate Consent Boxes: ${answers.understands_consent_boxes || "N/A"}
- No Pre-checked Consent: ${answers.no_prechecked_consent || "N/A"}
${buildWebsiteSection(answers, websiteContent)}
${existingTermsContent ? `
EXISTING TERMS & CONDITIONS TO UPDATE:
The user has existing terms & conditions they want updated for A2P compliance. Keep their existing language and structure where appropriate, but ADD all the required SMS/messaging sections and A2P-specific language. Here is their current document (fetched from ${answers.existing_terms_url || "their website"}):

${existingTermsContent}

Update the above terms to include all A2P requirements listed below. Keep existing sections that are still relevant.
` : ""}
${buildUseCaseSection(answers)}${buildIndustryRestrictionSection(answers)}${buildConsentAnchorSection(consentCheckboxes, restricted)}${buildPrivacyPolicyReferenceSection(privacyPolicyContent)}${analysisHistory}
Generate the COMPLETE terms & conditions in HTML format. Write EVERY section fully — no placeholders, no shortcuts, no "[insert here]" markers. This must be ready to copy-paste onto a website immediately.

CRITICAL A2P requirements to include:
1. Acceptance of terms
2. Description of service (including SMS messaging program)
3. User eligibility (must be 18+, US-based)
4. SMS/Text Messaging Terms — MUST include:
   - Program description (marketing and transactional campaigns, or transactional-only for restricted industries)
   - Consent mechanism — THREE paragraph structure:
     Paragraph 1: What affirmative action is required to opt in (unchecked checkbox)
     Paragraph 2: "Providing a phone number alone does not constitute SMS consent" — standalone paragraph
     Paragraph 3: SMS consent and terms agreement are two entirely separate checkboxes serving distinct purposes
   - TWO separate consent disclosures (marketing + non-marketing) — or one transactional-only for restricted industries
   - Explicit statement: "By opting in, you agree to receive [marketing/service] text messages"
   - Message frequency for each campaign type
   - "Msg &amp; data rates may apply"
   - Opt-out: "Reply STOP to opt out." — NEVER "unsubscribe" or "cancel"
   - Help: "Reply HELP for info." or "Reply HELP for help."
   - Statement that consent is not a condition of purchase
   - Statement that SMS opt-in data is not shared with third parties
   - Opt-out confirmation: "The opt-out confirmation message will identify ${answers.legal_business_name || "[Business Name]"} by name and confirm that no further messages will be sent."
   - START re-enrollment: "If you wish to re-enroll after opting out, you may text START to ${answers.stop_help_number || "[phone]"} or re-submit your SMS consent through the opt-in checkbox on the website at ${answers.primary_website || "[URL]"}."
   - Cross-reference to Privacy Policy retention periods: "SMS consent records are retained in accordance with the retention periods set forth in our Privacy Policy, which is incorporated herein by reference."
   - SMS-related liability exclusions: delivery failures, carrier charges, failure to opt out, provision of number not belonging to user, reactivation after opt-out without new consent
   - Prohibition on SMS data sharing survives corporate restructuring
5. Intellectual property
6. Prohibited conduct
7. Disclaimers and warranties ("as is" service)
8. Limitation of liability
9. Indemnification
10. Termination
11. Dispute resolution and governing law (${answers.business_state || "applicable state"}) — jurisdiction, arbitration venue, and governing law must ALL reference this same single state
12. Arbitration clause and class action waiver
13. Jury trial waiver
14. Severability
15. Entire agreement clause
16. Force majeure covering SMS delivery
17. No third-party beneficiaries
18. Changes to terms
19. Contact information`;
}

const SUBMISSION_SYSTEM_PROMPT = `You are an expert A2P 10DLC registration specialist writing for the most demanding carrier reviewer possible. Your job is to generate the exact text fields needed to fill out an A2P campaign registration form. These fields will be copy-pasted directly into the registration portal. One wrong word causes rejection. Follow every rule below exactly.

CRITICAL KEYWORD RULES — READ FIRST:
- The STOP keyword phrase is ALWAYS "Reply STOP to opt out." — NEVER "unsubscribe", NEVER "cancel", NEVER "stop receiving messages." The exact phrase "opt out" is mandatory everywhere it appears.
- The HELP keyword phrase is ALWAYS "Reply HELP for info." or "Reply HELP for help."
- The data rates phrase is ALWAYS "Msg & data rates may apply." — not "message and data rates", not "standard rates."
- Do NOT include ANY URLs or links in sample messages — not shortened URLs (bit.ly), not full URLs, not even the business's own website. Carriers flag URLs in sample messages as spam and will reject the campaign. Sample messages must contain only plain text content with no web addresses whatsoever.

You MUST output ONLY valid JSON with no markdown, no code fences, no extra text. The JSON must have these exact keys:

- "use_case_description": (min 40 chars, max 4096 chars) KEEP THIS SIMPLE AND DIRECT. Write it like you're explaining the business to someone in 30 seconds. Do NOT write an essay. Do NOT use legal jargon. Do NOT pad with filler words. A good use_case_description is 3-5 short sentences that answer:
  1. What does this business do? (one sentence — name + industry + who they serve)
  2. What texts do they send? (name 2-4 specific message types — NOT "updates and notifications")
  3. How did recipients opt in? (one sentence — "Customers opt in via [mechanism] on [URL]")
  4. For restricted industries only: what will NEVER be sent (one sentence naming the prohibition)

  EXAMPLE OF GOOD (simple, clear, specific):
  "[Business Name] is a mortgage lending company serving homebuyers in Florida. After borrowers opt in via the contact form at example.com, we send application status updates, document request notifications, closing date reminders, and rate lock confirmations. All messages are triggered by activity on the borrower's active loan file. No promotional, marketing, or solicitation messages are sent."

  EXAMPLE OF BAD (too long, too wordy, legal-sounding):
  "[Business Name], a duly licensed mortgage lending institution operating under the regulatory purview of RESPA, TILA, and Regulation Z, utilizes SMS messaging exclusively for the purpose of facilitating transactional communications with borrowers who have affirmatively opted in..."

  The reviewer reads hundreds of these. Simple and specific wins. Verbose and legal-sounding gets scrutinized.

- "sample_message_1": (min 20 chars, max 1024 chars) A realistic sample transactional/service message. MUST follow this exact format: "[Business Name]: [Specific transactional content related to recipient's existing account/file/transaction]. Reply STOP to opt out. Msg & data rates may apply." The message MUST start with the business name followed by a colon. Must include "Reply STOP to opt out." (not "unsubscribe"). Must include "Msg & data rates may apply." MUST NOT contain any URLs or web links — carriers flag URLs in sample messages as spam.

- "sample_message_2": (min 20 chars, max 1024 chars) A second realistic sample message (different message type than sample 1). For restricted industries: MUST be another transactional message — no promotional content whatsoever. For unrestricted industries: can be a promotional/marketing message. Same format requirements as sample_message_1 — start with "[Business Name]:", include "Reply STOP to opt out." and "Msg & data rates may apply." MUST NOT contain any URLs or web links.

- "opt_in_description": (min 40 chars, max 2048 chars) This field must walk the reviewer through the EXACT opt-in journey step by step so they can follow it on the website. Structure it in this order:

  PART 1 — THE OPT-IN JOURNEY (step-by-step):
  Start by describing HOW someone gets to the page where they enter their phone number. The reviewer will open the website and try to follow these steps. If the business uses a multi-step form, questionnaire, application, or checkout flow, describe each step:
  "Contacts opt in at [URL]. The opt-in process works as follows: [step 1], [step 2], [step 3]... On the [final step / contact details page], the visitor enters their name, email, and phone number."

  EXAMPLE for a multi-step flow: "Contacts opt in at example.com/get-quote. Visitors click the 'Get a Free Quote' button on the homepage, which takes them to a 4-step questionnaire. They answer questions about their project type, budget, timeline, and location. On the final step, they enter their name, email address, and phone number. Below the phone number field, two separate unchecked SMS consent checkboxes are displayed."

  EXAMPLE for a simple form: "Contacts opt in at example.com/contact. The contact page displays a form with fields for name, email, and phone number. Below the phone number field, two separate unchecked SMS consent checkboxes are displayed."

  PART 2 — THE SEVEN REQUIRED STATEMENTS (include all of these after the journey):
  1. "The checkbox is never pre-checked, pre-selected, or activated by default."
  2. "Providing a phone number on the form alone does not constitute SMS consent. Consent requires the separate, affirmative act of checking the designated checkbox."
  3. "The SMS consent checkbox is separate from any other form agreement or terms acceptance checkbox."
  4. "The consent disclosure is displayed immediately adjacent to the unchecked checkbox."
  5. "Links to the Privacy Policy and Terms and Conditions are displayed on the form adjacent to the checkbox."
  6. "Consent is not a condition of purchase or service."

  PART 3 — VERBATIM CONSENT TEXT:
  After all statements, quote the verbatim consent disclosure text from the consent checkboxes.

  CRITICAL: The opt-in journey description is what makes or breaks MESSAGE_FLOW rejections. If the reviewer can't figure out how to get to the consent checkboxes on the website, they reject. Be specific about the URL, what buttons to click, and what steps the visitor completes before reaching the phone number field.

- "opt_in_message": (max 320 chars) The confirmation message sent after opt-in. Must include: business name at the start followed by colon, what they signed up for, message frequency, "Msg & data rates may apply.", "Reply STOP to opt out.", "Reply HELP for help." DUAL-PROGRAM REQUIREMENT: For unrestricted businesses with BOTH marketing and transactional programs, the opt-in message MUST reference both program types — e.g., "You're now signed up for promotional and service texts from [Business Name]." Do NOT describe only one program when the business has two. For restricted (transactional-only) businesses, reference only service/transactional texts.

- "marketing_consent_checkbox": Checkbox text for marketing SMS consent. Must include ALL of: consent to marketing texts from the business with parenthetical examples of message types, msg frequency (exact number from data), "Msg & data rates may apply.", "Reply STOP to opt out.", "Reply HELP for info.", "Consent is not required for purchase.", "SMS opt-in data is never shared with third parties."

- "transactional_consent_checkbox": Checkbox text for transactional/service SMS consent. Use "service texts" not "transactional texts" in consumer-facing language. Must include ALL of: consent to service texts from the business with parenthetical examples (e.g. reminders, updates, confirmations), msg frequency, "Msg & data rates may apply.", "Reply STOP to opt out.", "Reply HELP for info.", "SMS opt-in data is never shared with third parties."

- "form_secondary_text": A secondary text block displayed below BOTH consent checkboxes on the form. This is what distinguishes approvals from MESSAGE_FLOW rejections. Must include ALL of these elements:
  1. For unrestricted businesses with TWO consent checkboxes (marketing + transactional): use "By checking the boxes above" (PLURAL) as the triggering action. For restricted businesses with only ONE checkbox (transactional only): use "By checking the box above" (SINGULAR). NEVER use "by providing your phone number and checking the box."
  2. Express written consent confirmation
  3. "The checkbox is never pre-checked."
  4. "Reply STOP to opt out."
  5. "Reply HELP for help."
  6. "Msg & data rates may apply."
  7. "Consent is not a condition of purchase or service."
  8. "No mobile information will be shared with third parties for marketing or promotional purposes."

FREQUENCY CONSISTENCY: The message frequency stated in ALL fields must match the exact frequency values from the business data provided. Use the exact number — do not substitute "varies" when a specific frequency is given.

USE CASE CLASSIFICATION — CRITICAL:
The business data will include an "A2P USE CASE CLASSIFICATION" field. This determines how you write EVERY field:

- CUSTOMER CARE: The use_case_description must describe a post-relationship maintenance program. Sample messages must ONLY be updates/reminders for existing customers with active accounts/services. NEVER include language about lead follow-up, outreach, or initial contact. The reviewer must believe these messages exist because a service is already underway.

- CONVERSATIONAL MESSAGING: The use_case_description must describe interactive, two-way communication with people who initiated contact. Sample messages must be questions or direct responses to inquiries — conversational tone, not automated. The reviewer must believe this is a back-and-forth interaction, not a broadcast.

- MARKETING: The use_case_description must be transparent about promotional intent. Sample messages can include offers, promotions, calls to action. Full SHAFT compliance needed.

- MIXED USE: The use_case_description must EXPLICITLY describe BOTH programs — pre-sale interaction (lead follow-up, qualifying) AND post-sale servicing (reminders, updates). sample_message_1 should show one side, sample_message_2 should show the other. The reviewer must believe this business genuinely does both. Documents that deny reality (claiming "only transactional" when the business clearly does lead follow-up) get rejected for inconsistency.

THE FIRST MESSAGE TEST: Whatever the use case, the sample_message_1 should reflect what the FIRST message to a new contact looks like. This is what the reviewer judges the entire campaign by.

IMPORTANT: Keep ALL fields concise and practical. Consent checkbox texts must be short — they need to fit next to a checkbox on a form. But the opt_in_description and use_case_description should be thorough since reviewers read them word by word.

Each field must be realistic, specific to the business, and ready to copy-paste. Do NOT use generic placeholder language. Use the actual business name and details provided.`;

function buildSubmissionLanguagePrompt(answers: Record<string, string>, websiteContent: string, _today: string, analysisHistory: string = ""): string {
  const restricted = isRestrictedIndustry(answers);
  const restrictedIndustries = restricted ? getSelectedRestricted(answers) : [];
  return `Generate A2P 10DLC registration form fields for the following business:

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
- Business Description: ${answers.business_description || "N/A"}
- Business Category: ${answers.business_category || "N/A"}
- Industry Classification: ${answers.industry_type || "N/A"}
- Website: ${answers.primary_website || "N/A"}
- Business Phone: ${answers.business_phone || "N/A"}
- Business Email: ${answers.business_email || "N/A"}

SMS CAMPAIGN USE CASES:
- Marketing Use Case: ${restricted ? "N/A — Restricted industry. This business does not send promotional or marketing SMS messages." : (answers.marketing_use_case || "N/A")}
- Marketing Message Types: ${restricted ? "None — transactional messages only per industry regulations" : (answers.marketing_message_types || "N/A")}
- Marketing Frequency: ${restricted ? "N/A — no marketing messages sent" : (answers.marketing_frequency || "N/A")}
- Transactional Use Case: ${answers.transactional_use_case || "N/A"}
- Transactional Message Types: ${answers.transactional_message_types || "N/A"}
- Transactional Frequency: ${answers.transactional_frequency || "N/A"}

OPT-IN DETAILS:
- Opt-in Locations: ${answers.optin_locations || "N/A"}
- Phone Field Required: ${answers.phone_field_required || "N/A"}
- Opt-in Flow Type: ${answers.optin_flow_type || "N/A"}
- Opt-in Journey Steps (CRITICAL — use this to describe the opt-in process step by step): ${answers.optin_journey_steps || "N/A"}
- Opt-in Page URL (direct URL where phone field and consent checkboxes appear): ${answers.optin_page_url || answers.primary_website || "N/A"}
- Support Email: ${answers.support_email || "N/A"}
- STOP/HELP Number: ${answers.stop_help_number || "N/A"}
${buildWebsiteSection(answers, websiteContent)}
${buildUseCaseSection(answers)}${buildIndustryRestrictionSection(answers)}
Generate the JSON with all 8 fields. Use "${answers.legal_business_name || "the business"}" as the business name in all messages. Make the messages sound natural and specific to this business.${restricted ? (() => {
    const uc = getUseCaseLabel(answers);
    const isCustomerCareOnly = uc === "Customer Care";
    if (isCustomerCareOnly) {
      return `

CRITICAL — RESTRICTED INDUSTRY, CUSTOMER CARE ONLY (${restrictedIndustries.join(", ")}):
- Both sample messages MUST be transactional only — updates/reminders for existing customers with active accounts/files. No inquiry follow-up, no lead response.
- The use_case_description MUST describe a transactional-only program and explicitly state what types of messages are NEVER sent.
- The opt_in_message and transactional_consent_checkbox must reflect transactional-only consent.
- For marketing_consent_checkbox, set it to this exact text: "Not applicable — This business operates in a regulated industry that restricts SMS messaging to transactional use only. Promotional or marketing text messages are not permitted for this business type per CTIA and carrier guidelines. A marketing consent checkbox should not be included on opt-in forms for this business."
- The form_secondary_text must use "By checking the box above" (SINGULAR) and state that no promotional messages are sent.`;
    }
    // Conversational or Mixed Use restricted industry
    return `

CRITICAL — RESTRICTED INDUSTRY, ${uc.toUpperCase()} (${restrictedIndustries.join(", ")}):
- This business responds to inbound inquiries AND/OR services existing clients. It does NOT send cold outreach or promotional blasts.
- sample_message_1 should be a CONVERSATIONAL follow-up to an inquiry (e.g., "Thanks for your inquiry — are you looking to purchase or refinance?"). This is the first message the reviewer will judge.
- sample_message_2 should be a TRANSACTIONAL update for an active file/account (e.g., "Your application is in review. We may need additional documents to continue processing.").
- The use_case_description must honestly describe BOTH conversational follow-up and transactional messaging. Do NOT claim "transactional only" if the business follows up on inquiries — that mismatch causes rejection.
- Use this positioning: "Messages are limited to responses to user inquiries, conversational follow-up, and transactional updates. No unsolicited promotional or marketing messages are sent. Messages are not sent to purchased lists or cold contacts."
- For marketing_consent_checkbox, set it to this exact text: "Not applicable — This business operates in a regulated industry. SMS communications are limited to responses to user inquiries, conversational follow-up, and transactional updates. Promotional or marketing text messages are not sent. A marketing consent checkbox should not be included on opt-in forms for this business."
- The opt_in_message and transactional_consent_checkbox should reference "service and follow-up texts" rather than just "service texts" — because this business also does conversational follow-up.
- The form_secondary_text must use "By checking the box above" (SINGULAR) and state that messages are limited to inquiry follow-up and transactional updates.`;
  })() : ""}

REMINDER: Every "Reply STOP" phrase must end with "to opt out" — NEVER "to unsubscribe" or "to cancel." This is checked by reviewers character by character.${analysisHistory}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_id, type, answers } = await req.json();

    if (!project_id || !type || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check regeneration limit (max 3 versions per document type)
    const supabaseCheck = createServiceClient();
    const { count } = await supabaseCheck
      .from("generated_documents")
      .select("id", { count: "exact", head: true })
      .eq("project_id", project_id)
      .eq("type", type);

    if (count !== null && count >= 10) {
      return NextResponse.json(
        { error: "You've reached the maximum number of regenerations (10) for this document. Please contact support at support@geta2papproved.com or start a new project to generate fresh documents." },
        { status: 429 }
      );
    }

    // Block fully prohibited industries
    if (isProhibitedIndustry(answers)) {
      return NextResponse.json(
        { error: "This business operates in an industry that is fully prohibited from A2P 10DLC registration by carriers and the CTIA. Document generation is not available for this industry type." },
        { status: 403 }
      );
    }

    // Fetch website content, existing policy URLs, and prior documents in parallel
    const websiteUrl = answers.primary_website || "";
    const isPPorTC = type === "privacy_policy" || type === "terms_conditions";
    const isTC = type === "terms_conditions";
    const existingPPUrl = answers.existing_privacy_policy_url || "";
    const existingTermsUrl = answers.existing_terms_url || "";

    const [websiteContent, submissionDoc, privacyDoc, existingPPContent, existingTermsContent, analysisHistory] = await Promise.all([
      websiteUrl ? fetchWebsiteContent(websiteUrl) : Promise.resolve(""),
      isPPorTC
        ? supabaseCheck
            .from("generated_documents")
            .select("content")
            .eq("project_id", project_id)
            .eq("type", "submission_language")
            .order("version", { ascending: false })
            .limit(1)
            .then(({ data }) => data?.[0] ?? null)
        : Promise.resolve(null),
      isTC
        ? supabaseCheck
            .from("generated_documents")
            .select("content")
            .eq("project_id", project_id)
            .eq("type", "privacy_policy")
            .order("version", { ascending: false })
            .limit(1)
            .then(({ data }) => data?.[0] ?? null)
        : Promise.resolve(null),
      (type === "privacy_policy" && existingPPUrl) ? fetchSingleUrl(existingPPUrl) : Promise.resolve(""),
      (type === "terms_conditions" && existingTermsUrl) ? fetchSingleUrl(existingTermsUrl) : Promise.resolve(""),
      // Fetch latest analysis history for feedback loop
      buildAnalysisHistorySection(supabaseCheck, project_id),
    ]);

    // Extract consent checkbox texts and other verbatim fields from submission language
    let consentCheckboxes: ConsentCheckboxes | null = null;
    if (submissionDoc) {
      try {
        const parsed = JSON.parse(submissionDoc.content);
        consentCheckboxes = {
          marketing: parsed.marketing_consent_checkbox ?? null,
          transactional: parsed.transactional_consent_checkbox ?? null,
          optInMessage: parsed.opt_in_message ?? null,
          formSecondaryText: parsed.form_secondary_text ?? null,
        };
      } catch {
        // Malformed JSON — proceed without consent anchoring
      }
    }

    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const isSubmissionLanguage = type === "submission_language";
    const prompt =
      type === "privacy_policy"
        ? buildPrivacyPolicyPrompt(answers, websiteContent, today, consentCheckboxes, existingPPContent, analysisHistory)
        : type === "submission_language"
        ? buildSubmissionLanguagePrompt(answers, websiteContent, today, analysisHistory)
        : buildTermsPrompt(answers, websiteContent, today, consentCheckboxes, privacyDoc?.content ?? null, existingTermsContent, analysisHistory);

    const stream = getAnthropic().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: isSubmissionLanguage ? 4000 : 64000,
      system: isSubmissionLanguage ? SUBMISSION_SYSTEM_PROMPT : SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const message = await stream.finalMessage();

    // If the model hit the token limit, the document is incomplete — don't save it
    if (message.stop_reason === "max_tokens") {
      return NextResponse.json(
        { error: "The document was too long to generate completely. If you linked an existing policy, try regenerating without it. If the issue persists, contact support@geta2papproved.com." },
        { status: 422 }
      );
    }

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    let generatedContent = content.text;

    // Strip markdown code fences if the AI wraps JSON in them
    if (isSubmissionLanguage) {
      generatedContent = generatedContent.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    }

    // Append SEO attribution footer to Privacy Policy and Terms & Conditions
    if (!isSubmissionLanguage) {
      generatedContent = generatedContent.trimEnd() +
        '\n\n<p style="margin-top: 2em; font-size: 0.85em; color: #6b7280; text-align: center;"><em>This document was generated by <a href="https://geta2papproved.com" target="_blank" rel="noopener noreferrer">GetA2PApproved.com</a></em></p>';
    }

    const { data: existing } = await supabaseCheck
      .from("generated_documents")
      .select("version")
      .eq("project_id", project_id)
      .eq("type", type)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = existing && existing.length > 0 ? existing[0].version + 1 : 1;

    const { data: doc, error } = await supabaseCheck
      .from("generated_documents")
      .insert({
        project_id,
        type,
        content: generatedContent,
        version: nextVersion,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving document:", error);
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
    }

    // Update project status
    await supabaseCheck
      .from("projects")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", project_id);

    return NextResponse.json({ document: doc });
  } catch (error: unknown) {
    console.error("AI generation error:", error);

    // Surface specific error messages
    let message = "Failed to generate document. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("credit balance is too low")) {
        message = "AI service billing issue. Please contact support.";
      } else if (error.message.includes("rate_limit")) {
        message = "AI service is busy. Please wait a moment and try again.";
      } else if (error.message.includes("overloaded")) {
        message = "AI service is temporarily overloaded. Please try again in a few minutes.";
      } else if (error.message.includes("authentication")) {
        message = "AI service configuration error. Please contact support.";
      } else if (error.message.includes("Streaming is required")) {
        message = "Document generation failed due to a configuration issue. Please contact support.";
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
