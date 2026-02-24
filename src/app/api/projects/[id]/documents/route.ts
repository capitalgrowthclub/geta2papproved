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
