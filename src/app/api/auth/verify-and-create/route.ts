import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

export async function POST(req: NextRequest) {
  const { phone, otp, email, password, firstName, lastName } = await req.json();

  if (!phone || !otp || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 1. Verify OTP with Twilio
  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const verifyRes = await fetch(
    `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SID}/VerificationCheck`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, Code: otp }),
    }
  );

  const verifyBody = await verifyRes.json().catch(() => ({}));

  if (!verifyRes.ok || verifyBody.status !== "approved") {
    return NextResponse.json(
      { error: "Invalid or expired verification code" },
      { status: 400 }
    );
  }

  // 2. OTP confirmed — now create the Supabase user
  const supabase = createServiceClient();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    phone,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: { first_name: firstName || "", last_name: lastName || "" },
  });

  if (createError) {
    console.error("Create user error:", createError);
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Insert users row
  await supabase.from("users").insert({
    id: data.user.id,
    email,
    is_paid: false,
    plan_type: "none",
    credits_remaining: 0,
  });

  return NextResponse.json({ success: true });
}
