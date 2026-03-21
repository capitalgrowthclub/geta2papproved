import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith("http")) return "";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
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

    if (text.length > 2000) text = text.substring(0, 2000) + "...";
    return text;
  } catch {
    return "";
  }
}

async function fetchAllWebsites(urlsRaw: string): Promise<string> {
  const urls = urlsRaw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter((u) => u.startsWith("http"));

  if (urls.length === 0) return "";

  const results = await Promise.all(urls.slice(0, 10).map(fetchWebsiteContent));

  return urls
    .slice(0, 10)
    .map((url, i) => (results[i] ? `--- ${url} ---\n${results[i]}` : ""))
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, questionId, businessContext } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // Fetch actual website content from all listed URLs
    const websiteUrls = businessContext?.Website || "";
    const websiteContent = websiteUrls ? await fetchAllWebsites(websiteUrls) : "";

    const contextLines = Object.entries(businessContext || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const siteCount = websiteContent ? (websiteContent.match(/^--- http/gm) || []).length : 0;

    const websiteSection = websiteContent
      ? `\n\nWEBSITE CONTENT (fetched from ${siteCount} of the business's listed URLs — synthesize ALL of them):\n${websiteContent}\n\nIMPORTANT: Read ALL of the website sections above, not just the first one. Combine and synthesize information from every site to form a complete picture of the business before answering. Do NOT ignore any site.`
      : "";

    // Special handling for use case recommendation
    const isUseCaseQuestion = questionId === "recommended_use_case";

    const systemPrompt = isUseCaseQuestion
      ? `You are an A2P 10DLC use case classification expert. Based on the business's messaging behavior, recommend the correct use case. You MUST respond with EXACTLY one of these four options (copy the text exactly):

- "Customer Care — Post-relationship maintenance only"
- "Conversational Messaging — Pre-relationship back-and-forth"
- "Marketing — Promotional and persuasion messaging"
- "Mixed Use — Both lead interaction and customer servicing"

CLASSIFICATION FRAMEWORK:
1. CUSTOMER CARE: Messages exist because a service is ALREADY underway. Recipients have an active account, contract, or service. Messages maintain/inform — they do NOT advance a sale. A form submission does NOT create a customer relationship. "Application received" is NOT customer care — the person is still a lead.

2. CONVERSATIONAL: The user raised their hand (form, text, etc.) and now you're interacting. No formal relationship yet. Messaging is interactive — questions, qualification, guidance. Even if the user submitted a form and expects contact, this is STILL conversational, not customer care.

3. MARKETING: Messages try to influence, convince, re-engage, or create urgency. Not tied to a specific user action. Exists to drive behavior.

4. MIXED USE: The business BOTH interacts with leads AND services customers. This is the most common for real businesses. If the business follows up with new inquiries AND sends updates to existing customers, it's Mixed Use.

KEY RULE: Classify based on what the FIRST message DOES, not what the business claims. If the first message asks a question → Conversational. If it updates an existing service → Customer Care. If it promotes → Marketing. If the business does both → Mixed Use.

Reply with ONLY the exact option text — nothing else.`
      : `You help businesses fill out A2P 10DLC compliance questionnaires. Given a question and business context, write a short, realistic answer that would help them get approved. The business may operate multiple websites — synthesize information from ALL of them to give an accurate, combined answer. Do NOT focus on just one site. Reply with ONLY the answer text — no quotes, no preamble, no explanation.

IMPORTANT COMPLIANCE RULES:
- For transactional/service message use cases: describe messages that RESPOND TO or CONFIRM actions the recipient already took. Phrase them to make clear the message confirms or responds to a recipient-initiated action. Example: "appointment reminders for appointments the client scheduled" not just "appointment reminders."
- For marketing use cases: describe promotional content specifically. Be concrete about what offers or content will be sent.
- Never use vague language like "updates and notifications" — always be specific about what types of updates.
- Keep answers concise (1-3 sentences) and specific to the business.
${businessContext?.["Recommended Use Case"] ? `\nThe recommended A2P use case is: ${businessContext["Recommended Use Case"]}. Tailor your answer to be consistent with this use case classification.` : ""}`;

    const anthropic = getAnthropic();
    const messageParams = {
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user" as const,
          content: `Business context:\n${contextLines || "No context yet"}${websiteSection}\n\nQuestion: ${question}\n\nWrite a realistic answer for this business:`,
        },
      ],
    };

    // Retry up to 2 times on 529 overload (temporary capacity issue)
    let message;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        message = await anthropic.messages.create(messageParams);
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if (status === 529 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }

    const content = message!.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    return NextResponse.json({ suggestion: content.text.trim() });
  } catch (error) {
    console.error("AI suggest error:", error);
    return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 });
  }
}
