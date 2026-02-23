import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
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

    if (text.length > 3000) text = text.substring(0, 3000) + "...";
    return text;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, businessContext } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // Fetch actual website content if a URL is provided
    const websiteUrl = businessContext?.Website || "";
    const websiteContent = websiteUrl ? await fetchWebsiteContent(websiteUrl) : "";

    const contextLines = Object.entries(businessContext || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const websiteSection = websiteContent
      ? `\n\nWEBSITE CONTENT (fetched from ${websiteUrl}):\n${websiteContent}\n\nUse the above website content to accurately understand what this business actually does. Do NOT guess based on the domain name.`
      : "";

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: `You help businesses fill out A2P 10DLC compliance questionnaires. Given a question and business context, write a short, realistic answer that would help them get approved. Be specific to their actual business — use the website content to understand what they do, not guesswork. Reply with ONLY the answer text — no quotes, no preamble, no explanation.`,
      messages: [
        {
          role: "user",
          content: `Business context:\n${contextLines || "No context yet"}${websiteSection}\n\nQuestion: ${question}\n\nWrite a realistic answer for this business:`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    return NextResponse.json({ suggestion: content.text.trim() });
  } catch (error) {
    console.error("AI suggest error:", error);
    return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 });
  }
}
