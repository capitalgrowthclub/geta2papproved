/**
 * Behavior Truth Object — Layer 1 of the compliance engine.
 *
 * Built from questionnaire answers BEFORE any document generation.
 * This is the single source of truth that all artifacts are derived from.
 * If documents don't match this object, they're wrong.
 */

import { isRestrictedIndustry, isProhibitedIndustry, getUseCaseLabel } from "./questionnaires/a2p-compliance";

// ─── Types ───

export type RecipientStage = "lead" | "customer" | "subscriber" | "mixed";
export type MessageDirection = "inbound_triggered" | "outbound_triggered" | "both";
export type FirstMessageType = "confirmation" | "conversational" | "transactional_update" | "promotional" | "automated_followup";

export interface MessageType {
  id: string;
  label: string;
  /** Does this message type need to be authorized in the consent checkbox? */
  requiresConsent: true;
  /** Category for consent grouping */
  consentCategory: "inquiry_response" | "follow_up" | "transactional" | "promotional";
}

export interface BehaviorModel {
  // Business identity
  businessName: string;
  businessCategory: string;
  industry: string;
  isRestricted: boolean;
  isProhibited: boolean;
  restrictedIndustries: string[];

  // First message behavior
  firstMessage: {
    trigger: string;
    purpose: string;
    type: FirstMessageType;
    example: string;
  };

  // Recipient state at first message
  recipientStage: RecipientStage;

  // All message types in program
  messageTypes: MessageType[];

  // Program characteristics
  hasConversational: boolean;
  hasTransactional: boolean;
  hasPromotional: boolean;
  messageDirection: MessageDirection;

  // Use case (deterministic)
  useCase: string;
  useCaseLabel: string;

  // Opt-in details
  optIn: {
    method: string;
    url: string;
    pageUrl: string;
    privacyPolicyUrl: string;
    termsUrl: string;
    journeySteps: string;
    flowType: string;
  };

  // Frequency
  marketingFrequency: string;
  transactionalFrequency: string;

  // Service providers (affects privacy language)
  serviceProviders: string[];
  hasVendors: boolean;

  // Content declarations
  hasDirectLending: boolean;
  hasEmbeddedLinks: boolean;
  hasEmbeddedPhone: boolean;
  hasAgeGated: boolean;

  // Consent scope — what the checkbox MUST authorize
  consentScope: {
    mustAuthorize: string[];
    consentDescription: string;
  };
}

// ─── Builder ───

export function buildBehaviorModel(answers: Record<string, string>): BehaviorModel {
  const firstMsgPurpose = answers.first_message_purpose || "";
  const stage = answers.contact_relationship_stage || "";
  const intent = answers.message_intent || "";
  const initiation = answers.message_initiation || "";

  // Determine first message type
  let firstMessageType: FirstMessageType = "confirmation";
  if (firstMsgPurpose.startsWith("A confirmation")) firstMessageType = "confirmation";
  else if (firstMsgPurpose.startsWith("A question")) firstMessageType = "conversational";
  else if (firstMsgPurpose.startsWith("An update")) firstMessageType = "transactional_update";
  else if (firstMsgPurpose.startsWith("A promotional")) firstMessageType = "promotional";
  else if (firstMsgPurpose.startsWith("An automated")) firstMessageType = "automated_followup";

  // Determine recipient stage
  let recipientStage: RecipientStage = "lead";
  if (stage.startsWith("They already paid")) recipientStage = "customer";
  else if (stage.startsWith("They took an action") || stage.startsWith("They just filled")) recipientStage = "lead";
  else if (stage.startsWith("They signed up for updates")) recipientStage = "subscriber";
  else if (stage.startsWith("It depends")) recipientStage = "mixed";

  // Determine message direction
  let messageDirection: MessageDirection = "both";
  if (initiation.startsWith("The customer")) messageDirection = "inbound_triggered";
  else if (initiation.startsWith("Our system")) messageDirection = "outbound_triggered";

  // Build message types from questionnaire
  const messageTypes: MessageType[] = [];
  const transactionalTypes = (answers.transactional_message_types || "").split("|||").filter(Boolean);
  const marketingTypes = (answers.marketing_message_types || "").split("|||").filter(Boolean);

  // First message is always a message type
  const firstMsgIsConversational = firstMessageType === "confirmation" ||
    firstMessageType === "conversational" ||
    firstMessageType === "automated_followup";

  if (firstMsgIsConversational && recipientStage !== "customer") {
    messageTypes.push({
      id: "inquiry_response",
      label: "Responses to inquiries and form submissions",
      requiresConsent: true,
      consentCategory: "inquiry_response",
    });
  }

  if (firstMessageType === "conversational" || intent.startsWith("To have back-and-forth")) {
    messageTypes.push({
      id: "follow_up",
      label: "Follow-up questions and qualification",
      requiresConsent: true,
      consentCategory: "follow_up",
    });
  }

  // Add transactional types
  for (const t of transactionalTypes) {
    messageTypes.push({
      id: `transactional_${t.toLowerCase().replace(/\s+/g, "_")}`,
      label: t,
      requiresConsent: true,
      consentCategory: "transactional",
    });
  }

  // Add marketing types (only if not restricted)
  const restricted = isRestrictedIndustry(answers);
  if (!restricted) {
    for (const m of marketingTypes) {
      messageTypes.push({
        id: `marketing_${m.toLowerCase().replace(/\s+/g, "_")}`,
        label: m,
        requiresConsent: true,
        consentCategory: "promotional",
      });
    }
  }

  const hasConversational = messageTypes.some(
    (m) => m.consentCategory === "inquiry_response" || m.consentCategory === "follow_up"
  );
  const hasTransactional = messageTypes.some((m) => m.consentCategory === "transactional");
  const hasPromotional = messageTypes.some((m) => m.consentCategory === "promotional");

  // Service providers
  const providers = (answers.uses_subcontractors || "").split("|||").filter(Boolean);
  const hasVendors = providers.length > 0 && !providers.includes("None of the above");

  // Industry flags
  const industryType = answers.industry_type || "";
  const isLending = industryType.includes("Mortgage") || industryType.includes("Banking") ||
    industryType.includes("Investment") || industryType.includes("Debt");
  const isHealthcare = industryType.includes("Healthcare");
  const isInsurance = industryType.includes("Insurance");

  // Consent scope — what the checkbox MUST authorize
  const mustAuthorize: string[] = [];
  if (hasConversational) {
    if (recipientStage === "lead" || recipientStage === "mixed") {
      mustAuthorize.push("responses to your inquiry");
      mustAuthorize.push("follow-up communications");
    }
  }
  if (hasTransactional) {
    // Build specific transactional descriptions
    const transDesc: string[] = [];
    if (transactionalTypes.some((t) => t.toLowerCase().includes("appointment") || t.toLowerCase().includes("booking"))) {
      transDesc.push("appointment reminders");
    }
    if (transactionalTypes.some((t) => t.toLowerCase().includes("order") || t.toLowerCase().includes("delivery"))) {
      transDesc.push("order updates");
    }
    if (transactionalTypes.some((t) => t.toLowerCase().includes("payment") || t.toLowerCase().includes("receipt"))) {
      transDesc.push("payment reminders");
    }
    if (transactionalTypes.some((t) => t.toLowerCase().includes("application") || t.toLowerCase().includes("status"))) {
      transDesc.push("application status updates");
    }
    if (transDesc.length === 0) transDesc.push("service updates");
    mustAuthorize.push(...transDesc);
  }
  if (hasPromotional) {
    mustAuthorize.push("promotional offers");
    mustAuthorize.push("marketing communications");
  }

  // Build consent description from what must be authorized
  let consentDescription = "";
  if (hasConversational && hasTransactional && !hasPromotional) {
    consentDescription = "service and follow-up texts";
  } else if (hasConversational && hasTransactional && hasPromotional) {
    consentDescription = "promotional, service, and follow-up texts";
  } else if (hasTransactional && !hasConversational) {
    consentDescription = "service texts";
  } else if (hasPromotional) {
    consentDescription = "promotional and service texts";
  } else {
    consentDescription = "text messages";
  }

  // Opt-in URLs
  const primaryWebsite = (answers.primary_website || "").split(/[\n,]/)[0]?.trim() || "";
  const optinPageUrl = answers.optin_page_url || primaryWebsite;

  // Derive PP and TC URLs from the primary website
  let ppUrl = "";
  let tcUrl = "";
  if (answers.existing_privacy_policy_url) {
    ppUrl = answers.existing_privacy_policy_url;
  } else if (primaryWebsite) {
    try {
      const base = new URL(primaryWebsite);
      ppUrl = `${base.origin}/privacy-policy`;
      tcUrl = `${base.origin}/terms`;
    } catch {
      ppUrl = primaryWebsite + "/privacy-policy";
      tcUrl = primaryWebsite + "/terms";
    }
  }
  if (answers.existing_terms_url) {
    tcUrl = answers.existing_terms_url;
  } else if (primaryWebsite && !tcUrl) {
    try {
      const base = new URL(primaryWebsite);
      tcUrl = `${base.origin}/terms`;
    } catch {
      tcUrl = primaryWebsite + "/terms";
    }
  }

  return {
    businessName: answers.legal_business_name || "",
    businessCategory: answers.business_category || "",
    industry: industryType,
    isRestricted: restricted,
    isProhibited: isProhibitedIndustry(answers),
    restrictedIndustries: restricted
      ? (answers.industry_type || "").split(",").map((s) => s.trim()).filter(Boolean)
      : [],

    firstMessage: {
      trigger: firstMsgPurpose,
      purpose: intent,
      type: firstMessageType,
      example: answers.first_message_example || "",
    },

    recipientStage,
    messageTypes,
    hasConversational,
    hasTransactional,
    hasPromotional,
    messageDirection,

    useCase: getUseCaseLabel(answers),
    useCaseLabel: getUseCaseLabel(answers),

    optIn: {
      method: answers.optin_flow_type || "website_checkbox",
      url: primaryWebsite,
      pageUrl: optinPageUrl,
      privacyPolicyUrl: ppUrl,
      termsUrl: tcUrl,
      journeySteps: answers.optin_journey_steps || "",
      flowType: answers.optin_flow_type || "",
    },

    marketingFrequency: restricted ? "N/A" : (answers.marketing_frequency || ""),
    transactionalFrequency: answers.transactional_frequency || "",

    serviceProviders: hasVendors ? providers.filter((p) => p !== "None of the above") : [],
    hasVendors,

    hasDirectLending: isLending,
    hasEmbeddedLinks: false, // We ban URLs in samples
    hasEmbeddedPhone: false,
    hasAgeGated: false,

    consentScope: {
      mustAuthorize,
      consentDescription,
    },
  };
}

// ─── Hard Gate Validators ───

export interface ValidationFailure {
  gate: string;
  severity: "critical";
  message: string;
  fix: string;
}

/**
 * GATE 1: checkbox_authorizes_first_message
 * If the first message is conversational but the checkbox only references
 * "service texts" / "account updates", the checkbox doesn't authorize the first text.
 */
export function validateCheckboxAuthorizesFirstMessage(model: BehaviorModel, checkboxText: string): ValidationFailure | null {
  if (!checkboxText) return null;

  const firstIsConversational = model.firstMessage.type === "confirmation" ||
    model.firstMessage.type === "conversational" ||
    model.firstMessage.type === "automated_followup";

  const recipientIsLead = model.recipientStage === "lead" || model.recipientStage === "mixed";

  if (firstIsConversational && recipientIsLead) {
    const lower = checkboxText.toLowerCase();
    const authorizesConversational =
      lower.includes("inquiry") ||
      lower.includes("follow-up") ||
      lower.includes("follow up") ||
      lower.includes("response") ||
      lower.includes("request");

    if (!authorizesConversational) {
      return {
        gate: "checkbox_authorizes_first_message",
        severity: "critical",
        message: `The first message is conversational (${model.firstMessage.type}) to a ${model.recipientStage}, but the consent checkbox only references service/transactional texts. The checkbox must clearly authorize inquiry responses and follow-up communications.`,
        fix: `Add "responses to your inquiry" or "follow-up communications" to the consent checkbox text. The checkbox must cover what the first text actually does.`,
      };
    }
  }

  return null;
}

/**
 * GATE 2: opt_in_flow_contains_required_links
 * The opt-in description must include the website URL, PP URL, and TC URL.
 */
export function validateOptInCompleteness(model: BehaviorModel, optInDescription: string): ValidationFailure | null {
  if (!optInDescription) return null;

  const lower = optInDescription.toLowerCase();
  const issues: string[] = [];

  if (!model.optIn.url && !model.optIn.pageUrl) {
    issues.push("opt-in website URL");
  }

  // Check if the opt-in description references the website
  if (model.optIn.pageUrl && !lower.includes(model.optIn.pageUrl.toLowerCase().replace(/^https?:\/\//, ""))) {
    // Try the primary website too
    if (model.optIn.url && !lower.includes(model.optIn.url.toLowerCase().replace(/^https?:\/\//, ""))) {
      issues.push("opt-in website URL");
    }
  }

  if (issues.length > 0) {
    return {
      gate: "opt_in_completeness",
      severity: "critical",
      message: `The opt-in description is missing: ${issues.join(", ")}. Twilio requires the website URL in the message flow description.`,
      fix: `Include the opt-in URL (${model.optIn.pageUrl || model.optIn.url}) in the opt-in description.`,
    };
  }

  return null;
}

/**
 * GATE 3: privacy_vendor_conflict
 * If vendors are disclosed, absolute non-sharing language is contradictory.
 */
export function validatePrivacyVendorConflict(model: BehaviorModel, privacyText: string): ValidationFailure | null {
  if (!privacyText || !model.hasVendors) return null;

  const lower = privacyText.toLowerCase();

  const hasAbsoluteLanguage =
    (lower.includes("never shared with third parties") && !lower.includes("for marketing or promotional purposes")) ||
    lower.includes("under any circumstances") ||
    lower.includes("for any purpose whatsoever") ||
    lower.includes("never sold, rented, shared, transferred, or disclosed to any third party");

  const disclosesVendors = model.serviceProviders.some((v) =>
    lower.includes(v.toLowerCase())
  );

  if (hasAbsoluteLanguage && disclosesVendors) {
    return {
      gate: "privacy_vendor_conflict",
      severity: "critical",
      message: `The Privacy Policy discloses service providers (${model.serviceProviders.join(", ")}) but also uses absolute non-sharing language ("never shared with third parties" without qualification). These contradict each other — service providers ARE third parties.`,
      fix: `Replace absolute language with the narrower approved pattern: "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes." This allows operational data sharing with service providers while prohibiting marketing use.`,
    };
  }

  return null;
}

/**
 * GATE 4: message_coverage
 * Every message type in the behavior model must appear in the use case description.
 */
export function validateMessageCoverage(model: BehaviorModel, useCaseDescription: string): ValidationFailure | null {
  if (!useCaseDescription) return null;

  const lower = useCaseDescription.toLowerCase();
  const missing: string[] = [];

  if (model.hasConversational && model.recipientStage !== "customer") {
    if (!lower.includes("inquiry") && !lower.includes("follow-up") && !lower.includes("follow up") && !lower.includes("request")) {
      missing.push("inquiry response / follow-up");
    }
  }

  if (model.hasTransactional) {
    if (!lower.includes("update") && !lower.includes("reminder") && !lower.includes("confirmation") && !lower.includes("notification")) {
      missing.push("transactional updates");
    }
  }

  if (model.hasPromotional) {
    if (!lower.includes("promot") && !lower.includes("market") && !lower.includes("offer")) {
      missing.push("promotional messages");
    }
  }

  if (missing.length > 0) {
    return {
      gate: "message_coverage",
      severity: "critical",
      message: `The use case description is missing these message types that are part of the actual program: ${missing.join(", ")}. Every message type must appear in the use case description.`,
      fix: `Add references to ${missing.join(" and ")} in the use case description to match the actual messaging program.`,
    };
  }

  return null;
}
