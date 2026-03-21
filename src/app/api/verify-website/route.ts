import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
    }

    // Fetch the page
    let html = "";
    let accessible = false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "GetA2PApproved/1.0 Compliance Checker" },
      });
      clearTimeout(timeout);
      if (res.ok) {
        html = await res.text();
        accessible = true;
      }
    } catch {
      // Page not accessible
    }

    if (!accessible) {
      return NextResponse.json({
        result: {
          url,
          accessible: false,
          hasPhoneField: false,
          hasCheckbox: false,
          hasPrivacyLink: false,
          hasTermsLink: false,
          hasConsentText: false,
          rawText: "",
          issues: ["Could not access the page. Make sure the URL is correct and the page is publicly accessible (not behind a login or password)."],
        },
      });
    }

    const htmlLower = html.toLowerCase();
    const issues: string[] = [];

    // Check for phone number field
    const hasPhoneField = /type\s*=\s*["']tel["']/i.test(html) ||
      /name\s*=\s*["'][^"']*phone[^"']*["']/i.test(html) ||
      /placeholder\s*=\s*["'][^"']*phone[^"']*["']/i.test(html) ||
      /phone\s*number/i.test(html);

    // Check for checkboxes
    const hasCheckbox = /type\s*=\s*["']checkbox["']/i.test(html);

    // Check for consent-related text near checkboxes
    const hasConsentText = /consent/i.test(html) ||
      /opt.?in/i.test(html) ||
      /agree to receive/i.test(html) ||
      /text\s*messages/i.test(html) ||
      /sms/i.test(html) ||
      /reply\s*stop/i.test(html);

    // Check for Privacy Policy link
    const hasPrivacyLink = /privacy\s*policy/i.test(html) &&
      (/<a\s[^>]*href/i.test(html));

    // Check for Terms link
    const hasTermsLink = /terms/i.test(html) &&
      (/<a\s[^>]*href/i.test(html));

    // Check for pre-checked checkboxes (bad!)
    const hasPreChecked = /checked\s*(?:=\s*["']?(?:checked|true|1)["']?|\s|>)/i.test(html) &&
      hasCheckbox;

    // Check for "Reply STOP" in visible text
    const hasStopLanguage = /reply\s*stop/i.test(html);

    // Check for "Msg & data rates" in visible text
    const hasRatesLanguage = /msg\s*(?:&amp;|&)\s*data\s*rates/i.test(html);

    // Build issues
    if (!hasPhoneField) {
      issues.push("No phone number field found on this page. Make sure this is the correct URL where contacts enter their phone number.");
    }

    if (!hasCheckbox) {
      issues.push("No checkboxes found on this page. SMS consent checkboxes must be visible on the form where phone numbers are collected.");
    }

    if (hasCheckbox && !hasConsentText) {
      issues.push("Checkboxes found but no SMS consent language detected. The checkbox needs consent text about text messages next to it.");
    }

    if (hasPreChecked) {
      issues.push("WARNING: Found a pre-checked checkbox on this page. All SMS consent checkboxes MUST start unchecked. Pre-checked boxes = automatic rejection.");
    }

    if (!hasPrivacyLink) {
      issues.push("No Privacy Policy link found on this page. A clickable link to your Privacy Policy must be visible near the consent checkboxes.");
    }

    if (!hasTermsLink) {
      issues.push("No Terms & Conditions link found on this page. A clickable link to your Terms must be visible near the consent checkboxes.");
    }

    if (hasConsentText && !hasStopLanguage) {
      issues.push("Consent text found but no 'Reply STOP' language detected. The consent disclosure should include 'Reply STOP to opt out.'");
    }

    if (hasConsentText && !hasRatesLanguage) {
      issues.push("Consent text found but no 'Msg & data rates may apply' language detected. This should be included in the consent disclosure.");
    }

    // Check if page is a SPA that might not render server-side
    const isSPA = htmlLower.includes("__next") || htmlLower.includes("react-root") ||
      htmlLower.includes("id=\"app\"") || htmlLower.includes("id=\"root\"");
    if (isSPA && !hasPhoneField && !hasCheckbox) {
      issues.push("This page appears to use JavaScript rendering (SPA). The form may not be visible in the initial HTML. If you know the form is there, you can manually verify the checklist items above.");
    }

    return NextResponse.json({
      result: {
        url,
        accessible,
        hasPhoneField,
        hasCheckbox,
        hasPrivacyLink,
        hasTermsLink,
        hasConsentText,
        rawText: "",
        issues,
      },
    });
  } catch (error) {
    console.error("Website verification error:", error);
    return NextResponse.json({ error: "Failed to verify website" }, { status: 500 });
  }
}
