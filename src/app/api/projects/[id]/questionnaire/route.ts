import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServiceClient();

    const { data: responses } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .eq("project_id", id);

    return NextResponse.json({ responses: responses || [] });
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { section, questions_answers, completed } = await req.json();

    const supabase = createServiceClient();

    // Upsert questionnaire response
    const { data, error } = await supabase
      .from("questionnaire_responses")
      .upsert(
        {
          project_id: id,
          section,
          questions_answers,
          completed: completed || false,
        },
        { onConflict: "project_id,section" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving questionnaire:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Update project status
    if (completed) {
      await supabase
        .from("projects")
        .update({ status: "in_progress", updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({ response: data });
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
