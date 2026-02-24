import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import crypto from "crypto";

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

    const { data: links } = await db
      .from("client_intake_links")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ links: links || [] });
  } catch (error) {
    console.error("Error fetching client links:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(
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
    const { section, client_name, client_email } = await req.json();

    if (!section) {
      return NextResponse.json({ error: "Section required" }, { status: 400 });
    }

    const db = createServiceClient();
    const token = crypto.randomUUID();

    const { data: link, error } = await db
      .from("client_intake_links")
      .insert({
        project_id: id,
        section,
        token,
        client_name: client_name || null,
        client_email: client_email || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating client link:", error);
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }

    await db
      .from("projects")
      .update({ status: "waiting_for_client", updated_at: new Date().toISOString() })
      .eq("id", id);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${baseUrl}/client-intake/${token}`;

    return NextResponse.json({ link, url });
  } catch (error) {
    console.error("Error creating client link:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
