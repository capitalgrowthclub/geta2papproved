import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

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
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Only allow embedding of privacy_policy and terms_conditions
    if (link.type === "submission_language") {
      return NextResponse.json(
        { error: "This document type cannot be embedded" },
        { status: 400, headers: CORS_HEADERS }
      );
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
      .select("content, type")
      .eq("project_id", link.project_id)
      .eq("type", link.type)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        html: doc.content,
        businessName: project?.business_name || "",
        type: doc.type,
      },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Embed fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load document" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
