import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    const db = createServiceClient();

    // Verify project ownership
    const { data: project } = await db
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch latest analysis
    const { data: analysis } = await db
      .from("analysis_history")
      .select("overall_risk, summary, issues, checks_passed, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!analysis) {
      return NextResponse.json({ analysis: null });
    }

    return NextResponse.json({
      analysis: {
        overall_risk: analysis.overall_risk,
        summary: analysis.summary,
        issues: analysis.issues,
        checks_passed: analysis.checks_passed,
      },
    });
  } catch (error) {
    console.error("Fetch analysis error:", error);
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
  }
}
