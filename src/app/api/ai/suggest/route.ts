import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
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

    const contextLines = Object.entries(businessContext || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");

    const message = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 300,
      system: `You help businesses fill out A2P 10DLC compliance questionnaires. Given a question and business context, write a short, realistic answer that would help them get approved. Be specific to their business type. Reply with ONLY the answer text — no quotes, no preamble, no explanation.`,
      messages: [
        {
          role: "user",
          content: `Business context:\n${contextLines || "No context yet"}\n\nQuestion: ${question}\n\nWrite a realistic answer for this business:`,
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
