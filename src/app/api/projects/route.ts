import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { canCreateProject, consumeCredit } from "@/lib/pricing";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Ensure user exists
    const clerkUser = await currentUser();
    await supabase.from("users").upsert(
      {
        clerk_id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        first_name: clerkUser?.firstName || "",
        last_name: clerkUser?.lastName || "",
        is_paid: false,
      },
      { onConflict: "clerk_id", ignoreDuplicates: true }
    );

    // Get user's internal id
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ projects: [] });
    }

    const { data: projects } = await supabase
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Project name required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Ensure user exists
    const clerkUser = await currentUser();
    await supabase.from("users").upsert(
      {
        clerk_id: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        first_name: clerkUser?.firstName || "",
        last_name: clerkUser?.lastName || "",
        is_paid: false,
      },
      { onConflict: "clerk_id", ignoreDuplicates: true }
    );

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user can create a project
    const check = canCreateProject({
      plan_type: user.plan_type || "none",
      credits_remaining: user.credits_remaining || 0,
      projects_used_this_period: user.projects_used_this_period || 0,
      plan_expires_at: user.plan_expires_at,
    });

    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 403 });
    }

    const { data: project, error } = await supabase
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

    // Consume credit after successful creation
    await consumeCredit(supabase, user.id);

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
