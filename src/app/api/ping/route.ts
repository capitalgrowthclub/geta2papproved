import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  // Lightweight DB ping to keep Supabase connection pool warm
  await createServiceClient().from("users").select("id").limit(1);
  return NextResponse.json({ ok: true });
}
