import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(
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

    // Verify the project belongs to this user
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
      .select("id, user_id, disclaimer_acknowledged")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Acknowledgment is permanent — if already acknowledged, just return success
    if (project.disclaimer_acknowledged) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("projects")
      .update({
        disclaimer_acknowledged: true,
        disclaimer_acknowledged_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error acknowledging disclaimer:", error);
      return NextResponse.json({ error: "Failed to save acknowledgment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error acknowledging disclaimer:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
