import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Public route — no auth required
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createServiceClient();

    // Look up the intake link
    const { data: link } = await supabase
      .from("client_intake_links")
      .select("*")
      .eq("token", token)
      .single();

    if (!link) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    // Get project info
    const { data: project } = await supabase
      .from("projects")
      .select("id, name, business_name")
      .eq("id", link.project_id)
      .single();

    // Get existing questionnaire answers (if any)
    const { data: response } = await supabase
      .from("questionnaire_responses")
      .select("questions_answers")
      .eq("project_id", link.project_id)
      .eq("section", "a2p_compliance")
      .single();

    return NextResponse.json({
      link,
      project,
      section: link.section,
      existingAnswers: response?.questions_answers || {},
    });
  } catch (error) {
    console.error("Error fetching client intake:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { answers } = await req.json();

    const supabase = createServiceClient();

    // Look up the intake link
    const { data: link } = await supabase
      .from("client_intake_links")
      .select("*")
      .eq("token", token)
      .single();

    if (!link) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    if (link.status === "submitted") {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }

    // Get existing answers and merge
    const { data: existing } = await supabase
      .from("questionnaire_responses")
      .select("questions_answers")
      .eq("project_id", link.project_id)
      .eq("section", "a2p_compliance")
      .single();

    const mergedAnswers = {
      ...(existing?.questions_answers || {}),
      ...answers,
    };

    // Upsert questionnaire response with merged answers
    await supabase
      .from("questionnaire_responses")
      .upsert(
        {
          project_id: link.project_id,
          section: "a2p_compliance",
          questions_answers: mergedAnswers,
          completed: false,
        },
        { onConflict: "project_id,section" }
      );

    // Mark link as submitted
    await supabase
      .from("client_intake_links")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", link.id);

    // Update project status
    await supabase
      .from("projects")
      .update({ status: "in_progress", updated_at: new Date().toISOString() })
      .eq("id", link.project_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting client intake:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
