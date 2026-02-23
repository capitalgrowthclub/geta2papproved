import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, type } = await params;

    if (type !== "privacy_policy" && type !== "terms_conditions" && type !== "submission_language") {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Verify project belongs to this user
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify the document has been generated
    const { data: doc } = await supabase
      .from("generated_documents")
      .select("id")
      .eq("project_id", projectId)
      .eq("type", type)
      .limit(1)
      .single();

    if (!doc) {
      return NextResponse.json(
        { error: "Document has not been generated yet" },
        { status: 400 }
      );
    }

    // Insert a new share link, or do nothing if one already exists for this project+type
    await supabase
      .from("document_share_links")
      .upsert(
        { project_id: projectId, type, token: randomUUID() },
        { onConflict: "project_id,type", ignoreDuplicates: true }
      );

    // Always fetch the canonical token (handles both new and existing)
    const { data: link } = await supabase
      .from("document_share_links")
      .select("token")
      .eq("project_id", projectId)
      .eq("type", type)
      .single();

    if (!link) {
      return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
    }

    const origin = req.headers.get("origin") || "https://www.geta2papproved.com";
    return NextResponse.json({ url: `${origin}/doc/${link.token}` });
  } catch (error) {
    console.error("Share doc error:", error);
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }
}
