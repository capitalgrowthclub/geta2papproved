import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createServiceClient();

    // Look up share link by token
    const { data: link } = await supabase
      .from("document_share_links")
      .select("project_id, type")
      .eq("token", token)
      .single();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Fetch project name
    const { data: project } = await supabase
      .from("projects")
      .select("business_name")
      .eq("id", link.project_id)
      .single();

    // Fetch latest version of the document
    const { data: doc } = await supabase
      .from("generated_documents")
      .select("content, type, version, created_at")
      .eq("project_id", link.project_id)
      .eq("type", link.type)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      document: doc,
      projectName: project?.business_name || "",
    });
  } catch (error) {
    console.error("Public doc fetch error:", error);
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
