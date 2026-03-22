import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase";
import { isRestrictedIndustry, getUseCaseLabel } from "@/lib/questionnaires/a2p-compliance";
import { buildBehaviorModel } from "@/lib/behavior-model";

export const maxDuration = 300;

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
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

const ANALYSIS_SYSTEM_PROMPT = `You are an A2P 10DLC carrier reviewer simulator. You check ONLY the things that actually cause campaign rejections. You do NOT flag edge cases, informational items, or things a real reviewer would never notice.

IMPORTANT — WHAT REAL REVIEWERS DO NOT CHECK (do NOT flag these):
- Phone numbers in contact sections vs SMS support lines (different numbers are normal)
- CCPA section framing ("based in" vs "operates in" vs "incorporated in") — reviewers don't read CCPA sections
- Jurisdiction nuances (Wyoming governing law with California address is common and legal)
- Address formatting (Suite vs Ste) — nobody rejects for this
- Carrier lists — minor detail
- Whether an email was cleaned from sample messages — if it was cleaned, that's correct, not an issue
- Opt-in confirmation wording nuances ("both phases" etc.) — if required elements are present, it passes
- Anything that is "technically imperfect but would never cause a rejection"

WHAT ACTUALLY CAUSES REJECTIONS (check ONLY these):

═══════════════════════════════════════════════
CHECK 1: PRIVACY POLICY — "NO SHARING" CLAUSE (#1 rejection reason)
═══════════════════════════════════════════════

The reviewer Ctrl+F's the Privacy Policy for "SMS" or "mobile."

REQUIRED: The sentence "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes." must exist.

If missing → CRITICAL.

Also: if the PP discloses vendors (GoHighLevel, Twilio, etc.) AND says "never shared with third parties under any circumstances" — that contradicts the vendor disclosures. Only the narrow "for marketing or promotional purposes" pattern is safe.

═══════════════════════════════════════════════
CHECK 2: SAMPLE MESSAGES MATCH USE CASE (#2 rejection reason)
═══════════════════════════════════════════════

The reviewer reads the use_case_description then reads the samples. They must tell the same story.

- Both samples start with "[Business Name]:" format
- At least one includes "Reply STOP to opt out." and "Msg & data rates may apply."
- NO URLs, web links, URL shorteners, or email addresses in samples — instant rejection
- sample_message_1 matches what the FIRST text to a new contact actually looks like
- Samples match the business category (service business = appointments/quotes, e-commerce = orders/shipping, etc.)
- For restricted industries: NO promotional language (offers, rates, urgency)
- Samples are IDENTICAL across all three documents (submission language, PP, TC) — character for character

═══════════════════════════════════════════════
CHECK 3: OPT-IN PROOF (#3 rejection reason)
═══════════════════════════════════════════════

- opt_in_description includes a real URL where the form lives
- Describes the steps to reach the consent checkbox
- Mentions that Privacy Policy and Terms links are on the form
- Is process-only — NO legal statements, NO "checkbox is never pre-checked", NO "consent is not a condition of purchase" in this field
- Is 2-4 sentences, not an essay

═══════════════════════════════════════════════
CHECK 4: CAMPAIGN DESCRIPTION QUALITY
═══════════════════════════════════════════════

- 3-5 sentences, specific and direct
- States: what the business does, what texts they send, how people opted in, what is NOT sent
- Matches the declared use case classification
- NOT vague ("sending updates to customers") and NOT a legal essay

═══════════════════════════════════════════════
CHECK 5: CONSENT CHECKBOX AUTHORIZES THE FIRST MESSAGE
═══════════════════════════════════════════════

The checkbox must clearly authorize whatever the first text message does.

- If first message is conversational follow-up to an inquiry but checkbox only says "service texts about your active account" → CRITICAL (checkbox didn't authorize that first text)
- If recipient is a lead, checkbox must mention inquiry responses or follow-up — not just transactional servicing
- All message types the business sends must be covered in the checkbox

═══════════════════════════════════════════════
CHECK 6: CROSS-DOCUMENT CONSISTENCY (only high-impact items)
═══════════════════════════════════════════════

- Consent checkbox text: IDENTICAL character-for-character across submission language, PP blockquote, TC blockquote (#1 consistency rejection)
- Sample messages: IDENTICAL across all three documents
- STOP language: "Reply STOP to opt out." everywhere — never "unsubscribe" or "cancel"
- Business name: same legal name everywhere
- Frequency: same numbers everywhere they appear

═══════════════════════════════════════════════
CHECK 7: RESTRICTED INDUSTRY LANGUAGE (only if restricted)
═══════════════════════════════════════════════

- Customer Care: hard prohibition sentences, no promotional language, samples are transactional only
- Conversational/Mixed Use: softer framing ("does not send unsolicited promotional or marketing SMS") — NOT hard prohibitions that contradict conversational behavior
- CRITICAL: "does not send promotional messages of any kind" + Conversational/Mixed Use = mismatch = rejection
- For lending: content_declarations should flag direct_lending

═══════════════════════════════════════════════
CHECK 8: STORY COHERENCE (the 30-second sniff test)
═══════════════════════════════════════════════

A real reviewer asks in 30 seconds:
1. "What does this business do and why are they texting people?" — Clear from description?
2. "Did people agree to get these texts?" — Opt-in description explains how?
3. "Do the samples match?" — Consistent with the description?
4. "Does anything smell off?" — Any contradictions?

═══════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════

Output ONLY valid JSON. No markdown, no code fences:
{
  "summary": "2-3 sentences for a business owner. Ready to submit or what to fix?",
  "overall_risk": "pass" | "needs_attention" | "at_risk",
  "compliance_score": 0-100. Start at 100. critical=-20, high=-10, medium=-5, low=-2. 90+=ready. 70-89=fix a few things. <70=significant issues.",
  "issues": [
    {
      "id": "issue_1",
      "severity": "critical" | "high" | "medium" | "low",
      "category": "check name",
      "title": "Short plain-English title",
      "simple_description": "1-2 sentences for a business owner. No jargon.",
      "description": "2-3 sentences with quoted evidence.",
      "affected_documents": ["submission_language", "privacy_policy", "terms_conditions"],
      "recommendation": "What to change — actionable"
    }
  ],
  "checks_passed": [
    { "title": "Check name", "description": "1 sentence" }
  ]
}

RULES:
- Maximum 6 issues. Only the most impactful.
- Only flag things that would ACTUALLY cause a rejection.
- Keep total response under 6,000 tokens.
- If everything looks good, say so. Don't invent problems.

Severity:
- critical: Automatic rejection (missing no-sharing clause, consent mismatch, URLs in samples, use case contradicts behavior)
- high: Likely rejection (samples don't match use case, opt-in missing URL, checkbox doesn't authorize first message)
- medium: Might get flagged (verbose description, frequency mismatch)
- low: Won't cause rejection but could improve

Overall risk:
- "pass": No critical or high issues. Ready to submit.
- "needs_attention": 1-2 medium issues. Will likely pass.
- "at_risk": Any critical or 2+ high. Fix before submitting.`;

function buildAnalysisPrompt(
  submissionContent: string,
  privacyContent: string,
  termsContent: string,
  answers: Record<string, string>,
  restricted: boolean
): string {
  const ppText = stripHtmlToText(privacyContent);
  const tcText = stripHtmlToText(termsContent);

  const ppTruncated = ppText.length > 20000 ? ppText.substring(0, 20000) + "... [truncated]" : ppText;
  const tcTruncated = tcText.length > 20000 ? tcText.substring(0, 20000) + "... [truncated]" : tcText;

  const useCase = getUseCaseLabel(answers);
  const behavior = buildBehaviorModel(answers);

  return `Review this A2P 10DLC registration package. Check all 8 categories. Only flag things that would actually cause a carrier reviewer to reject.

═══════════════════════════════════════════════
QUESTIONNAIRE ANSWERS (source of truth)
═══════════════════════════════════════════════
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
- Business Description: ${answers.business_description || "N/A"}
- Business State: ${answers.business_state || "N/A"}
- Business Address: ${answers.business_address || "N/A"}
- Business Category: ${answers.business_category || "N/A"}
- Industry Type: ${answers.industry_type || "N/A"}
- Restricted Industry: ${restricted ? "YES" : "NO"}
- A2P Use Case Classification: ${useCase}

BEHAVIOR MODEL:
- First Message Type: ${behavior.firstMessage.type}
- First Message Trigger: ${behavior.firstMessage.trigger}
- First Message Example: ${behavior.firstMessage.example || "N/A"}
- Recipient Stage: ${behavior.recipientStage}
- Has Conversational: ${behavior.hasConversational}
- Has Transactional: ${behavior.hasTransactional}
- Has Promotional: ${behavior.hasPromotional}
- Consent Must Authorize: ${behavior.consentScope.mustAuthorize.join(", ") || "service texts"}
- Service Providers: ${behavior.serviceProviders.join(", ") || "None"}
- Has Vendors: ${behavior.hasVendors}
- Direct Lending: ${behavior.hasDirectLending}

MESSAGING:
- First Message Purpose: ${answers.first_message_purpose || "N/A"}
- Contact Relationship Stage: ${answers.contact_relationship_stage || "N/A"}
- Message Intent: ${answers.message_intent || "N/A"}
- First Message Example: ${answers.first_message_example || "N/A"}
- Sample Messages Provided: ${answers.sample_messages || "N/A"}

CAMPAIGN:
- Marketing Frequency: ${restricted ? "N/A (restricted)" : (answers.marketing_frequency || "N/A")}
- Transactional Frequency: ${answers.transactional_frequency || "N/A"}
- Transactional Message Types: ${answers.transactional_message_types || "N/A"}

OPT-IN:
- Flow Type: ${answers.optin_flow_type || "N/A"}
- Journey Steps: ${answers.optin_journey_steps || "N/A"}
- Page URL: ${answers.optin_page_url || "N/A"}
- Primary Website: ${answers.primary_website || "N/A"}

═══════════════════════════════════════════════
SUBMISSION LANGUAGE (JSON)
═══════════════════════════════════════════════
${submissionContent}

═══════════════════════════════════════════════
PRIVACY POLICY
═══════════════════════════════════════════════
${ppTruncated}

═══════════════════════════════════════════════
TERMS & CONDITIONS
═══════════════════════════════════════════════
${tcTruncated}

═══════════════════════════════════════════════
Run all 8 checks. Only flag real rejection risks. Output JSON.`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_id } = await req.json();

    if (!project_id) {
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }

    const supabaseService = createServiceClient();

    // Fetch all documents and questionnaire in parallel
    const [docsResult, questResult] = await Promise.all([
      supabaseService
        .from("generated_documents")
        .select("type, content, version")
        .eq("project_id", project_id)
        .order("version", { ascending: false }),
      supabaseService
        .from("questionnaire_responses")
        .select("questions_answers")
        .eq("project_id", project_id)
        .eq("section", "a2p_compliance")
        .single(),
    ]);

    if (!docsResult.data || !questResult.data) {
      return NextResponse.json({ error: "Project data not found" }, { status: 404 });
    }

    // Get latest version of each document type
    const latestByType: Record<string, string> = {};
    for (const doc of docsResult.data) {
      if (!latestByType[doc.type]) {
        latestByType[doc.type] = doc.content;
      }
    }

    const submissionContent = latestByType["submission_language"];
    const privacyContent = latestByType["privacy_policy"];
    const termsContent = latestByType["terms_conditions"];

    if (!submissionContent || !privacyContent || !termsContent) {
      const missing = [];
      if (!submissionContent) missing.push("Submission Language");
      if (!privacyContent) missing.push("Privacy Policy");
      if (!termsContent) missing.push("Terms & Conditions");
      return NextResponse.json(
        { error: `Missing documents: ${missing.join(", ")}. Generate all three documents before running analysis.` },
        { status: 400 }
      );
    }

    const answers = questResult.data.questions_answers;
    const restricted = isRestrictedIndustry(answers);

    const prompt = buildAnalysisPrompt(
      submissionContent,
      privacyContent,
      termsContent,
      answers,
      restricted
    );

    // Retry up to 2 times on overload errors
    let message;
    const streamParams = {
      model: "claude-sonnet-4-6" as const,
      max_tokens: 16000,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user" as const, content: prompt }],
    };
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const stream = getAnthropic().messages.stream(streamParams);
        message = await stream.finalMessage();
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        const errorType = (err as { error?: { type?: string } }).error?.type;
        if ((status === 529 || errorType === "overloaded_error") && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }

    const content = message!.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 });
    }

    // Strip markdown code fences if present
    let analysisText = content.text
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      console.error("Failed to parse analysis JSON:", analysisText.substring(0, 500));
      return NextResponse.json(
        { error: "Analysis produced invalid results. Please try again." },
        { status: 500 }
      );
    }

    // Save analysis to history for feedback loop into future regenerations
    await supabaseService
      .from("analysis_history")
      .insert({
        project_id,
        overall_risk: analysis.overall_risk || "needs_attention",
        summary: analysis.summary || "",
        issues: analysis.issues || [],
        checks_passed: analysis.checks_passed || [],
      });

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    console.error("AI analysis error:", error);

    let message = "Failed to analyze documents. Please try again.";
    if (error instanceof Error) {
      if (error.message.includes("credit balance is too low")) {
        message = "AI service billing issue. Please contact support.";
      } else if (error.message.includes("rate_limit")) {
        message = "AI service is busy. Please wait a moment and try again.";
      } else if (error.message.includes("overloaded")) {
        message = "AI service is temporarily overloaded. Please try again in a few minutes.";
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
