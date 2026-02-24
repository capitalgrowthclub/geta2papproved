import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { canCreateProject, consumeCredit } from "@/lib/pricing";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServiceClient();

    const { data: projects } = await db
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Project name required" }, { status: 400 });
    }

    const db = createServiceClient();

    const { data: userData } = await db
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const check = canCreateProject({
      plan_type: userData.plan_type || "none",
      credits_remaining: userData.credits_remaining || 0,
      projects_used_this_period: userData.projects_used_this_period || 0,
      plan_expires_at: userData.plan_expires_at,
    });

    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 403 });
    }

    const { data: project, error } = await db
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        business_name: name,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    await consumeCredit(db, user.id);

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
