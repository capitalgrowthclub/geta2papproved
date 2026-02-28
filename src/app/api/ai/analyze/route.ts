import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase";
import { isRestrictedIndustry } from "@/lib/questionnaires/a2p-compliance";

export const maxDuration = 120;

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

const ANALYSIS_SYSTEM_PROMPT = `You are an expert A2P 10DLC compliance auditor. You have been given three documents generated for a single business's A2P 10DLC registration: the Submission Language (JSON fields for the registration form), the Privacy Policy (HTML converted to text), and the Terms & Conditions (HTML converted to text). You also have the business's questionnaire answers as the source of truth.

Your job is to perform a rigorous cross-document compliance review, as if you are the strictest carrier reviewer examining these documents before approving or rejecting an A2P 10DLC campaign registration.

CHECK EVERY ONE OF THESE CATEGORIES:

1. CONSENT TEXT CONSISTENCY: Compare the consent checkbox texts from the Submission Language (marketing_consent_checkbox and transactional_consent_checkbox) against the "Consent Disclosure" blockquotes in both the Privacy Policy and Terms & Conditions. They must match CHARACTER FOR CHARACTER. Flag any word substitution, reordering, punctuation change, or synonym swap (e.g., "service texts" vs "service messages", "promotional texts" vs "marketing messages"). This is the most common cause of rejection.

2. FREQUENCY CONSISTENCY: The message frequency stated in the Submission Language use_case_description, opt_in_message, consent checkboxes, Privacy Policy, and Terms & Conditions must all match the questionnaire answers for marketing_frequency and transactional_frequency. Flag any mismatch or "varies" substitution.

3. MANDATORY ELEMENTS IN CONSENT BLOCKS: Each consent disclosure quoted in the Privacy Policy and Terms must contain all six required elements: (a) message type + business name, (b) frequency, (c) "Msg & data rates may apply.", (d) "Reply STOP to opt out.", (e) "Reply HELP for info.", (f) "SMS opt-in data is never shared with third parties."

4. OPT-OUT LANGUAGE: Every STOP reference across all documents must say "Reply STOP to opt out." — never "Reply STOP to unsubscribe", "Reply STOP to cancel", or other variants. Check every occurrence.

5. CARRIER LIST: If carrier lists are mentioned in Privacy Policy or Terms, they must NOT include Sprint (absorbed into T-Mobile). Only: AT&T, Verizon, T-Mobile, Boost Mobile, MetroPCS, and U.S. Cellular.

6. JURISDICTION CONSISTENCY: Governing law state, arbitration venue, and jurisdiction for non-arbitrable claims in the Terms must all reference the same single state matching the business_state from questionnaire answers.

7. BUSINESS NAME CONSISTENCY: The legal business name must be used consistently across all three documents and match the questionnaire data. Check for inconsistent name usage.

8. REQUIRED PRIVACY POLICY SECTIONS: Verify the Privacy Policy contains:
   - "Explicit Prohibition on SMS Opt-In Data Sharing" as a named subsection
   - "We do not purchase, rent, or acquire personal information from data brokers..." statement
   - Dual consent mechanism statement (phone number alone ≠ consent)
   - Staff training clause with anonymized data language
   - SMS opt-out permanent retention statement
   - SMS opt-in 5-year retention statement
   - "Consent is not required as a condition of purchasing" statement
   - START re-enrollment disclosure in opt-out section
   - Opt-out confirmation identifying business by name
   - Prohibition survives restructuring statement

9. REQUIRED TERMS & CONDITIONS SECTIONS: Verify the Terms contain:
   - START re-enrollment disclosure in opt-out section
   - Opt-out confirmation identifying business by name
   - Consent not a condition of purchase statement
   - SMS data sharing prohibition survives corporate restructuring
   - Force majeure covering SMS delivery

10. RESTRICTED INDUSTRY COMPLIANCE (if industry_type indicates a restricted industry): Verify that:
    - All four prohibition sentences appear in both PP and TC
    - No promotional or marketing language exists anywhere
    - Sample messages pass the transactional message test (recipient initiated, not persuasive, makes sense as response)
    - Marketing consent checkbox is set to "Not applicable"

11. SAMPLE MESSAGE FORMAT: Sample messages in the Submission Language must:
    - Start with "[Business Name]:" format
    - Include "Reply STOP to opt out." (not "unsubscribe")
    - Include "Msg & data rates may apply."
    - Contain NO URLs or web links of any kind

12. OPT-IN CONFIRMATION MESSAGE: For unrestricted businesses with both marketing AND transactional programs, the opt_in_message must reference BOTH program types. For restricted businesses, it should reference only service/transactional texts.

13. FORM SECONDARY TEXT: The form_secondary_text field must use:
    - "By checking the boxes above" (PLURAL) for unrestricted businesses with two consent checkboxes
    - "By checking the box above" (SINGULAR) for restricted businesses with one checkbox
    Must NOT say "by providing your phone number and checking the box."

14. ADDRESS FORMATTING: Suite/Ste format must be consistent throughout all documents (not "Suite 200" in one place and "Ste 200" in another).

15. HTML ENCODING: In the original HTML documents, "&" should be encoded as "&amp;" — but since you're reviewing text-converted versions, check that "Msg & data rates may apply" appears consistently (not "Msg and data rates" or other variations).

Output ONLY valid JSON with no markdown, no code fences, no extra text. Use this exact schema:
{
  "summary": "1-2 sentence overall assessment of the documents",
  "overall_risk": "pass" or "needs_attention" or "at_risk",
  "issues": [
    {
      "id": "issue_1",
      "severity": "critical" or "high" or "medium" or "low",
      "category": "category_name",
      "title": "Short descriptive title",
      "description": "Detailed description of what's wrong, quoting the specific text if relevant",
      "affected_documents": ["submission_language", "privacy_policy", "terms_conditions"],
      "recommendation": "What specifically should be changed to fix this"
    }
  ],
  "checks_passed": [
    {
      "title": "Check name",
      "description": "Brief description of what was verified and found correct"
    }
  ]
}

Severity guide:
- critical: Will cause carrier rejection (consent text mismatch, missing mandatory elements, wrong STOP language, URLs in samples)
- high: Likely causes rejection or manual review flag (frequency mismatch, jurisdiction split, Sprint in carrier list, opt-in message missing program type)
- medium: May cause reviewer concern (minor inconsistencies, formatting issues, missing non-critical sections)
- low: Best practice improvement (wording improvements, clarity enhancements)

Overall risk guide:
- "pass": No critical or high issues. Documents are ready for submission.
- "needs_attention": Has medium issues or 1 high issue that should be addressed but may not cause rejection.
- "at_risk": Has any critical issues, or 2+ high issues. Likely to be rejected without fixes.

Be thorough but precise. Do NOT invent issues that don't exist. If a check passes, include it in checks_passed. Only report real, specific problems with quoted evidence.`;

function buildAnalysisPrompt(
  submissionContent: string,
  privacyContent: string,
  termsContent: string,
  answers: Record<string, string>,
  restricted: boolean
): string {
  const ppText = stripHtmlToText(privacyContent);
  const tcText = stripHtmlToText(termsContent);

  const ppTruncated = ppText.length > 60000 ? ppText.substring(0, 60000) + "... [truncated]" : ppText;
  const tcTruncated = tcText.length > 60000 ? tcText.substring(0, 60000) + "... [truncated]" : tcText;

  return `Analyze these three A2P 10DLC documents for cross-document compliance:

QUESTIONNAIRE ANSWERS (source of truth for business details):
- Legal Business Name: ${answers.legal_business_name || "N/A"}
- DBA Names: ${answers.has_dba === "Yes" ? answers.dba_names || "N/A" : "None"}
- Business State: ${answers.business_state || "N/A"}
- Industry Type: ${answers.industry_type || "N/A"}
- Restricted Industry: ${restricted ? "YES — transactional messages only" : "NO — unrestricted (marketing + transactional)"}
- Marketing Frequency: ${restricted ? "N/A (restricted)" : (answers.marketing_frequency || "N/A")}
- Transactional Frequency: ${answers.transactional_frequency || "N/A"}
- STOP/HELP Number: ${answers.stop_help_number || "N/A"}
- Primary Website: ${answers.primary_website || "N/A"}
- Support Email: ${answers.support_email || "N/A"}
- Business Address: ${answers.business_address || "N/A"}

=== SUBMISSION LANGUAGE (JSON) ===
${submissionContent}

=== PRIVACY POLICY (text content) ===
${ppTruncated}

=== TERMS & CONDITIONS (text content) ===
${tcTruncated}

Perform the full compliance review across all 15 check categories and output the JSON analysis.`;
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

    const stream = getAnthropic().messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    const message = await stream.finalMessage();

    const content = message.content[0];
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
