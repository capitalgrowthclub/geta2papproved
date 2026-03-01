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

    const { id } = await params;
    const db = createServiceClient();

    const { data: documents } = await db
      .from("generated_documents")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ documents: documents || [] });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { documentId, content } = await req.json();

    if (!documentId || !content) {
      return NextResponse.json({ error: "documentId and content are required" }, { status: 400 });
    }

    const db = createServiceClient();

    // Verify document belongs to this project
    const { data: doc } = await db
      .from("generated_documents")
      .select("id")
      .eq("id", documentId)
      .eq("project_id", id)
      .single();

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const { data: updated, error } = await db
      .from("generated_documents")
      .update({ content })
      .eq("id", documentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }

    return NextResponse.json({ document: updated });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
