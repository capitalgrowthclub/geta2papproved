import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase";
import { isProhibitedIndustry, isRestrictedIndustry, getSelectedRestricted } from "@/lib/questionnaires/a2p-compliance";

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

const SYSTEM_PROMPT = `You are an expert legal document generator specializing in A2P 10DLC compliance. Your job is to generate privacy policies and terms & conditions that will pass carrier review for A2P 10DLC campaign registration.

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

FORMAT REQUIREMENTS:
- Use clean semantic HTML: h1 for the document title, h2 for major sections, h3 for subsections, p for paragraphs, ul/ol/li for lists
- Include proper section numbering in headings (e.g. "1. Information We Collect")
- Write every section completely — this is a real legal document, not a template
- CRITICAL: Do NOT use any style="" attributes or inline CSS on any element whatsoever
- CRITICAL: Do NOT wrap the document in a <div> with max-width, width, margin, padding, or font-family styles
- CRITICAL: Do NOT include any <style> tags or font-family declarations anywhere
- Output the document content directly — start with <h1> for the title, then proceed with sections
- The styling is handled externally — just output clean, unstyled semantic HTML

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

  const perIndustryRules = restricted.map((industry) => {
    const rules = INDUSTRY_RULES[industry];
    if (!rules) return `\n${industry}: Restricted to transactional messages only. No promotional messaging permitted.`;
    return `
${industry.toUpperCase()}:
  Regulatory note: ${rules.regulatoryNote}
  PROHIBITED messages (never include, never reference):
    ${rules.prohibited.map((p) => `• ${p}`).join("\n    ")}
  ALLOWED messages (transactional only, triggered by user action or account event):
    ${rules.allowed.map((a) => `• ${a}`).join("\n    ")}`;
  }).join("\n");

  return `
INDUSTRY RESTRICTION — CRITICAL — READ BEFORE GENERATING:
This business operates in a regulated industry that is PERMITTED to register for A2P 10DLC but is RESTRICTED TO TRANSACTIONAL MESSAGES ONLY: ${restricted.join(", ")}.

UNIVERSAL RULES FOR ALL RESTRICTED INDUSTRIES:
1. This business does NOT send promotional, marketing, or solicitation SMS messages. Remove ALL promotional SMS language from the document.
2. The SMS program is limited EXCLUSIVELY to transactional messages triggered by specific user actions or account events. Broadcast or scheduled marketing messages are not sent.
3. Every generated document must state affirmatively and explicitly that this business does not use SMS for promotional or marketing purposes.
4. The marketing_use_case and marketing_message_types fields below should be treated as N/A and ignored — the business cannot send promotional SMS regardless of what was entered there.
5. Every message identifies the business by name, includes STOP opt-out language, and includes "Msg & data rates may apply."
6. SMS opt-in consent cannot be shared with or transferred to any third party under any circumstance.
7. Any message with a promotional call to action, a discount, a rate quote, or language designed to persuade rather than inform is prohibited.
8. Any message sent to a cold contact who did not affirmatively opt in is prohibited.

SPECIFIC RULES BY INDUSTRY:${perIndustryRules}

Write the SMS/messaging sections of all documents to strictly reflect these restrictions. Use firm, affirmative policy statements — not caveats or suggestions.
`;
}

function buildPrivacyPolicyPrompt(answers: Record<string, string>, websiteContent: string, today: string): string {
  const restricted = isRestrictedIndustry(answers);
  return `Generate a comprehensive Privacy Policy for A2P 10DLC compliance based on the following business information:

TODAY'S DATE: ${today} — use this as the "Last Updated" and "Effective Date" in the document.

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
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
${answers.existing_privacy_policy ? `
EXISTING PRIVACY POLICY TO UPDATE:
The user has an existing privacy policy they want updated for A2P compliance. Keep their existing language and structure where appropriate, but ADD all the required SMS/messaging sections and A2P-specific language. Here is their current policy:

${answers.existing_privacy_policy.length > 50000 ? answers.existing_privacy_policy.substring(0, 50000) + "\n\n[Document truncated for length — continue generating a complete policy incorporating the above content plus all A2P requirements]" : answers.existing_privacy_policy}

Update the above policy to include all A2P requirements listed below. Keep existing sections that are still relevant.
` : ""}
${buildIndustryRestrictionSection(answers)}
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

function buildTermsPrompt(answers: Record<string, string>, websiteContent: string, today: string): string {
  const restricted = isRestrictedIndustry(answers);
  return `Generate comprehensive Terms & Conditions for A2P 10DLC compliance based on the following information:

TODAY'S DATE: ${today} — use this as the "Last Updated" and "Effective Date" in the document.

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
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
${answers.existing_terms ? `
EXISTING TERMS & CONDITIONS TO UPDATE:
The user has existing terms & conditions they want updated for A2P compliance. Keep their existing language and structure where appropriate, but ADD all the required SMS/messaging sections and A2P-specific language. Here is their current document:

${answers.existing_terms.length > 50000 ? answers.existing_terms.substring(0, 50000) + "\n\n[Document truncated for length — continue generating complete terms incorporating the above content plus all A2P requirements]" : answers.existing_terms}

Update the above terms to include all A2P requirements listed below. Keep existing sections that are still relevant.
` : ""}
${buildIndustryRestrictionSection(answers)}
Generate the COMPLETE terms & conditions in HTML format. Write EVERY section fully — no placeholders, no shortcuts, no "[insert here]" markers. This must be ready to copy-paste onto a website immediately.

CRITICAL A2P requirements to include:
1. Acceptance of terms
2. Description of service (including SMS messaging program)
3. User eligibility (must be 18+, US-based)
4. SMS/Text Messaging Terms — MUST include:
   - Program description (marketing and transactional campaigns)
   - Consent mechanism description
   - TWO separate consent disclosures (marketing + non-marketing)
   - Explicit statement: "By opting in, you agree to receive [marketing/transactional] text messages"
   - Message frequency for each campaign type
   - "Message and data rates may apply"
   - Opt-out: "Reply STOP to cancel at any time"
   - Help: "Reply HELP for assistance or contact ${answers.support_email || "support"}"
   - Statement that consent is not a condition of purchase
   - Statement that SMS opt-in data is not shared with third parties
5. Intellectual property
6. Prohibited conduct
7. Disclaimers and warranties ("as is" service)
8. Limitation of liability
9. Indemnification
10. Termination
11. Dispute resolution and governing law (${answers.business_state || "applicable state"})
12. Severability
13. Changes to terms
14. Contact information`;
}

const SUBMISSION_SYSTEM_PROMPT = `You are an expert A2P 10DLC registration specialist. Your job is to generate the exact text fields needed to fill out an A2P campaign registration form. These fields will be copy-pasted directly into the registration portal.

You MUST output ONLY valid JSON with no markdown, no code fences, no extra text. The JSON must have these exact keys:
- "use_case_description": A concise description of how the business uses SMS messaging (min 40 chars, max 4096 chars). Keep it focused and direct — 2-4 sentences. Must mention: message types sent, consent collected via compliant opt-in, recipients can opt out by replying STOP.
- "sample_message_1": A realistic sample transactional/service message from the business (min 20 chars, max 1024 chars). Must include the business name, a specific message example, and "Reply STOP to unsubscribe."
- "sample_message_2": A realistic sample marketing/promotional message from the business (min 20 chars, max 1024 chars). Must include the business name, a different message type than sample 1, and "Reply STOP to unsubscribe."
- "opt_in_description": Concise description of how contacts opt in (min 40 chars, max 2048 chars). Keep it to 2-3 sentences. Must mention: specific opt-in method, that the form includes SMS consent language, and the website URL.
- "opt_in_message": The confirmation message sent after someone opts in (max 320 chars). Must include: business name, what they signed up for, message frequency note, "Msg & data rates may apply", "Reply STOP to opt out", "Reply HELP for help."
- "marketing_consent_checkbox": SHORT checkbox text for marketing SMS consent. Keep it to 1-2 concise sentences max. Must mention: consent to marketing texts from the business, msg frequency, "Msg & data rates may apply", "Reply STOP to cancel", consent not required for purchase. Example: "I agree to receive marketing texts from [Business Name]. Up to [X] msgs/mo. Msg & data rates may apply. Reply STOP to cancel. Consent not required for purchase."
- "transactional_consent_checkbox": SHORT checkbox text for transactional SMS consent. Keep it to 1-2 concise sentences max. Must mention: consent to service texts from the business (e.g. reminders, updates), "Msg & data rates may apply", "Reply STOP to cancel". Example: "I agree to receive service texts from [Business Name] (e.g. appointment reminders, updates). Msg frequency varies. Msg & data rates may apply. Reply STOP to cancel."

IMPORTANT: Keep ALL fields concise and practical. Avoid verbose, overly-detailed language. Each field should be the minimum length needed to meet carrier requirements while remaining compliant. Consent checkbox texts especially must be short — they need to fit next to a small checkbox on a form.

Each field must be realistic, specific to the business, and ready to copy-paste. Do NOT use generic placeholder language. Use the actual business name and details provided.`;

function buildSubmissionLanguagePrompt(answers: Record<string, string>, websiteContent: string, _today: string): string {
  const restricted = isRestrictedIndustry(answers);
  return `Generate A2P 10DLC registration form fields for the following business:

BUSINESS IDENTITY:
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
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
- Support Email: ${answers.support_email || "N/A"}
- STOP/HELP Number: ${answers.stop_help_number || "N/A"}
${buildWebsiteSection(answers, websiteContent)}
${buildIndustryRestrictionSection(answers)}
Generate the JSON with all 7 fields. Use "${answers.legal_business_name || "the business"}" as the business name in all messages. Make the messages sound natural and specific to this business.${restricted ? " CRITICAL: Both sample messages must be transactional only — no promotional content, no offers, no solicitations. The use_case_description must describe a transactional-only program. The opt_in_message and checkbox texts must reflect transactional-only consent. Set marketing_consent_checkbox to null or omit it — this business does not send marketing SMS." : ""}`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
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

    if (count !== null && count >= 3) {
      return NextResponse.json(
        { error: "You've reached the maximum number of regenerations for this document. Please contact support at support@geta2papproved.com for assistance." },
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

    // Fetch website content for AI context
    const websiteUrl = answers.primary_website || "";
    const websiteContent = websiteUrl ? await fetchWebsiteContent(websiteUrl) : "";

    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const isSubmissionLanguage = type === "submission_language";
    const prompt =
      type === "privacy_policy"
        ? buildPrivacyPolicyPrompt(answers, websiteContent, today)
        : type === "submission_language"
        ? buildSubmissionLanguagePrompt(answers, websiteContent, today)
        : buildTermsPrompt(answers, websiteContent, today);

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
        { error: "The document was too long to generate completely. Try removing or shortening any existing policy content you pasted in, then regenerate. If the issue persists, contact support@geta2papproved.com." },
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

    const supabase = createServiceClient();

    const { data: existing } = await supabase
      .from("generated_documents")
      .select("version")
      .eq("project_id", project_id)
      .eq("type", type)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = existing && existing.length > 0 ? existing[0].version + 1 : 1;

    const { data: doc, error } = await supabase
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
    await supabase
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
