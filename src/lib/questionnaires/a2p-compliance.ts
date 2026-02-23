export interface Question {
  id: string;
  question: string;
  type: "text" | "textarea" | "select" | "multi-select";
  placeholder?: string;
  helperText?: string;
  /** Recommendation tip shown in a highlighted box below the helper text */
  recommendationText?: string;
  options?: string[];
  required?: boolean;
  clientFacing?: boolean;
  /** If true, the "Write with AI" button will appear for this question */
  aiSuggest?: boolean;
  /** If true, an "Other" text field will appear for select/multi-select questions */
  allowOther?: boolean;
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const a2pComplianceQuestions: QuestionSection[] = [
  // ─── SECTION 1: BUSINESS IDENTITY (Client-Facing) ───
  {
    id: "business_identity",
    title: "Business Identity",
    description: "Basic business details — these must match your brand registration exactly or your A2P application will be rejected.",
    questions: [
      {
        id: "legal_business_name",
        question: "What is your business's legal name?",
        type: "text",
        placeholder: "e.g., Your Business Name LLC",
        helperText: "This MUST match exactly what's on your EIN letter from the IRS (CP 575 or 147C). If your registration says 'LLC' at the end, include 'LLC' here. Carriers will reject applications where the business name doesn't match.",
        required: true,
        clientFacing: true,
      },
      {
        id: "has_dba",
        question: "Does your business go by any other names (DBA)?",
        type: "select",
        options: ["No", "Yes"],
        helperText: "A DBA (Doing Business As) is a trade name your business uses publicly. For example, if your legal name is 'Smith Holdings LLC' but you operate as 'Smith Realty', that's a DBA.",
        required: true,
        clientFacing: true,
      },
      {
        id: "dba_names",
        question: "What are those other names?",
        type: "text",
        placeholder: "e.g., My Trade Name, My Other Brand",
        helperText: "List all DBA names separated by commas. These will be included in your legal documents.",
        clientFacing: true,
      },
      {
        id: "ein_number",
        question: "What is your EIN (Employer Identification Number)?",
        type: "text",
        placeholder: "e.g., 12-3456789",
        helperText: "This is the 9-digit number the IRS assigned to your business (format: XX-XXXXXXX). You can find it on your IRS letter CP 575 or 147C. This is required for brand registration verification.",
        required: true,
        clientFacing: true,
      },
      {
        id: "business_address",
        question: "What is your business address?",
        type: "text",
        placeholder: "e.g., 123 Main St, Suite 100, Austin, TX 78701",
        helperText: "Enter your full street address, city, state, and zip code. This must match what's on file with your SMS/CRM platform. P.O. Boxes are not accepted.",
        required: true,
        clientFacing: true,
      },
      {
        id: "business_phone",
        question: "What is your business phone number?",
        type: "text",
        placeholder: "e.g., (512) 555-1234",
        helperText: "This should be the main business number registered with your texting platform. It will appear in your privacy policy and terms as the contact number.",
        required: true,
        clientFacing: true,
      },
      {
        id: "business_email",
        question: "What is your business email address?",
        type: "text",
        placeholder: "e.g., info@yourbusiness.com",
        helperText: "This email will be listed in your legal documents for privacy and compliance inquiries. Use a professional email — not a personal Gmail/Yahoo address.",
        required: true,
        clientFacing: true,
      },
      {
        id: "primary_website",
        question: "List all website URLs where you collect customer opt-ins or send SMS messaging",
        type: "textarea",
        placeholder: "https://www.yourbusiness.com\nhttps://yourbusiness.com/contact\nhttps://landingpage.yourbusiness.com",
        helperText: "Enter one URL per line. Include every page where customers can opt in to receive SMS messages — your main site, landing pages, contact forms, checkout pages, etc. Carriers will verify each URL listed.",
        recommendationText: "Only list websites that are part of the same business and SMS program. Unrelated businesses or brands each require a separate A2P registration — mixing them in one registration is a common reason for rejection.",
        required: true,
        clientFacing: true,
      },
    ],
  },

  // ─── SECTION 2: SMS CAMPAIGN USE CASES ───
  {
    id: "sms_campaigns",
    title: "SMS Campaign Use Cases",
    description: "Carriers need to know exactly what you're texting people and why. Be specific — vague answers get rejected.",
    questions: [
      {
        id: "marketing_use_case",
        question: "What will you use marketing text messages for?",
        type: "textarea",
        placeholder: "Describe in 1-2 sentences what promotional texts you'll send...",
        helperText: "WHY THIS MATTERS: Carriers review this to make sure you're not spamming people. Be specific about what your business does and what kind of promotional content you'll send. Example: 'We send promotional offers about real estate investment opportunities and educational content about the local housing market.'",
        required: true,
        aiSuggest: true,
      },
      {
        id: "marketing_message_types",
        question: "What types of marketing messages will you send?",
        type: "multi-select",
        options: [
          "Special offers & promotions",
          "New product/service announcements",
          "Educational tips & content",
          "Event invitations",
          "Seasonal campaigns",
          "Newsletter-style updates",
          "Referral program messages",
          "Re-engagement messages",
        ],
        helperText: "WHY THIS MATTERS: Each type of marketing message needs to be disclosed in your terms. Select all that apply and use the 'Other' field to add anything specific to your business (e.g., 'Weekly property listings', 'Flash sale alerts'). The more specific you are, the better your documents will be.",
        recommendationText: "Select every type you might ever send — it's much easier to include them now than to update your documents later. Use the Other field to describe your most common message type in your own words.",
        required: true,
        allowOther: true,
      },
      {
        id: "marketing_frequency",
        question: "How often will you send marketing messages?",
        type: "select",
        options: [
          "Up to 2 messages per month",
          "Up to 4 messages per month",
          "Up to 8 messages per month",
          "Up to 12 messages per month",
          "Up to 16 messages per month",
          "Up to 20 messages per month",
        ],
        helperText: "WHY THIS MATTERS: Your privacy policy and terms MUST state the message frequency. Carriers will reject you if your actual sending exceeds what's stated. Pick a realistic maximum — you can always send fewer.",
        recommendationText: "We recommend 'Up to 4 messages per month' for most businesses. This gives you enough flexibility for weekly promos without raising carrier flags. Only go higher if you genuinely send that many.",
        required: true,
      },
      {
        id: "transactional_use_case",
        question: "What will you use non-marketing (transactional) text messages for?",
        type: "textarea",
        placeholder: "Describe in 1-2 sentences what informational texts you'll send...",
        helperText: "WHY THIS MATTERS: Transactional messages are non-promotional — things like appointment reminders, order updates, or account alerts. Carriers treat these differently from marketing messages and they need a separate consent box on your forms.",
        required: true,
        aiSuggest: true,
      },
      {
        id: "transactional_message_types",
        question: "What types of transactional messages will you send?",
        type: "multi-select",
        options: [
          "Appointment reminders",
          "Order/delivery status updates",
          "Payment reminders & receipts",
          "Account security alerts",
          "Application status updates",
          "Booking confirmations",
          "Customer support responses",
          "Service outage notifications",
        ],
        helperText: "WHY THIS MATTERS: These must be listed in your terms & conditions under a separate non-marketing SMS section. Use the 'Other' field to add anything specific to your business.",
        recommendationText: "Most businesses should at minimum select 'Appointment reminders' or 'Booking confirmations' plus 'Customer support responses'. Add your own specific use case with the Other field.",
        required: true,
        allowOther: true,
      },
      {
        id: "transactional_frequency",
        question: "How often will you send transactional messages?",
        type: "select",
        options: [
          "Only when triggered by client activity",
          "Up to 5 messages per month",
          "Up to 10 messages per month",
          "Up to 15 messages per month",
          "Up to 25 messages per month",
          "As needed based on account activity",
        ],
        helperText: "WHY THIS MATTERS: Even transactional messages need a frequency cap disclosed in your terms. 'As needed based on account activity' is acceptable for most businesses.",
        recommendationText: "We recommend 'As needed based on account activity' — this is the safest choice for transactional messages since they're triggered by customer actions and hard to predict exactly.",
        required: true,
      },
    ],
  },

  // ─── SECTION 3: OPT-IN FORM DETAILS ───
  {
    id: "optin_details",
    title: "Opt-In Form Details",
    description: "How people sign up to receive your texts. This is the #1 reason A2P applications get rejected — your opt-in flow must be airtight.",
    questions: [
      {
        id: "optin_locations",
        question: "Where do people sign up to receive your text messages?",
        type: "multi-select",
        options: [
          "Website contact form",
          "Landing page form",
          "Calendar/booking page",
          "CRM form or funnel page",
          "In-person sign-up (paper or tablet)",
          "Phone call (verbal consent)",
          "Text-to-join (keyword opt-in)",
          "Social media lead form",
        ],
        helperText: "WHY THIS MATTERS: Carriers will verify that every place someone can opt in has proper consent language. Every form listed here needs two separate, unchecked consent checkboxes — one for marketing messages and one for non-marketing messages.",
        required: true,
      },
      {
        id: "phone_field_required",
        question: "Are phone number fields required or optional on your forms?",
        type: "select",
        options: ["Required", "Optional"],
        helperText: "WHY THIS MATTERS: If the phone field is required, your consent language must clearly state that providing a phone number and consenting to messages is NOT required to use your service or make a purchase.",
        recommendationText: "We recommend making phone fields 'Required' if texting is core to your service. Just make sure your consent language states it's not required for purchase — we'll handle that in your documents.",
        required: true,
      },
      {
        id: "prechecked_consent",
        question: "Are any consent checkboxes pre-checked by default on your forms?",
        type: "select",
        options: ["No — none are pre-checked", "Yes — some are pre-checked"],
        helperText: "CRITICAL: Pre-checked consent boxes are an automatic rejection. All SMS consent checkboxes MUST start unchecked — the user has to actively check them. If yours are pre-checked, you'll need to fix this before applying.",
        required: true,
      },
      {
        id: "policy_links_visible",
        question: "Are your Privacy Policy and Terms & Conditions links visible on all your forms?",
        type: "select",
        options: [
          "Yes — visible in the footer of all forms",
          "Yes — visible near the consent checkboxes",
          "No — not on all forms yet",
          "I don't have policy pages yet",
        ],
        helperText: "WHY THIS MATTERS: Every form that collects a phone number must have clickable links to your Privacy Policy and Terms & Conditions. Carriers check for this. We'll generate both documents for you.",
        recommendationText: "Best practice: Place policy links directly next to or below the consent checkboxes — not just in the footer. Carriers are more likely to approve when links are clearly visible near the opt-in area.",
        required: true,
      },
    ],
  },

  // ─── SECTION 4: SUPPORT & OPT-OUT ───
  {
    id: "support_optout",
    title: "Support & Opt-Out",
    description: "How people stop receiving messages and get help. This must be included in every text campaign.",
    questions: [
      {
        id: "stop_help_number",
        question: "What phone number handles STOP and HELP replies?",
        type: "text",
        placeholder: "e.g., (512) 555-1234",
        helperText: "WHY THIS MATTERS: When someone texts STOP or HELP, it goes to this number. This is usually the number registered with your SMS platform. Carriers require that STOP immediately unsubscribes the person and HELP returns support info.",
        required: true,
      },
      {
        id: "support_email",
        question: "What email should people contact for SMS support questions?",
        type: "text",
        placeholder: "e.g., support@yourbusiness.com",
        helperText: "WHY THIS MATTERS: Your terms must list an email for SMS program support. This is where people can reach you if they have questions about the messages they're receiving.",
        required: true,
      },
      {
        id: "tollfree_number",
        question: "Do you have a toll-free support number?",
        type: "select",
        options: [
          "No — I don't have one",
          "Yes — I have a toll-free number",
        ],
        helperText: "This is optional but can be included in your documents if you have one.",
      },
      {
        id: "tollfree_details",
        question: "What is your toll-free number?",
        type: "text",
        placeholder: "e.g., 1-800-555-1234",
        helperText: "Leave blank if not applicable. Most businesses don't have one and that's perfectly fine for A2P approval.",
      },
    ],
  },

  // ─── SECTION 5: DATA SHARING & THIRD PARTIES ───
  {
    id: "data_sharing",
    title: "Data Sharing & Third Parties",
    description: "Carriers are strict about this. If you share SMS opt-in data with anyone, it can cause an automatic rejection.",
    questions: [
      {
        id: "shares_optin_data",
        question: "Do you share, sell, or transfer SMS opt-in data (phone numbers) to any third parties?",
        type: "select",
        options: ["No — we never share opt-in data", "Yes — we share with some parties"],
        helperText: "CRITICAL: For A2P approval, your privacy policy MUST explicitly state that SMS opt-in consent data is NOT shared with or sold to third parties. If you currently share this data, you need to stop before applying. This is one of the top reasons for rejection.",
        recommendationText: "You MUST select 'No' for A2P approval. If you currently share opt-in data, stop doing so before submitting your application. There is no workaround for this requirement.",
        required: true,
      },
      {
        id: "passes_leads",
        question: "Do you pass leads to agents, brokers, or other partners?",
        type: "select",
        options: [
          "No — we handle all leads internally",
          "Yes — we pass leads to partners/agents",
        ],
        helperText: "WHY THIS MATTERS: Passing leads is fine, but the lead passing must NOT include the SMS opt-in consent. The person receiving the lead would need to get their own separate consent to text that lead.",
        required: true,
      },
      {
        id: "lead_passing_tied_to_sms",
        question: "Is the lead passing connected to the SMS opt-in in any way?",
        type: "select",
        options: [
          "No — they are completely separate",
          "Yes — the opt-in data goes with the lead",
          "N/A — I don't pass leads",
        ],
        helperText: "CRITICAL: If you pass opt-in data along with leads, this MUST be changed. SMS consent cannot be transferred to third parties.",
        required: true,
      },
      {
        id: "uses_subcontractors",
        question: "What tools and services do you use for SMS delivery and customer management?",
        type: "multi-select",
        options: [
          "GoHighLevel",
          "Twilio",
          "Stripe (payments)",
          "Zapier / Make",
          "External customer support team",
          "IT / technical support vendor",
          "None of the above",
        ],
        helperText: "WHY THIS MATTERS: Your privacy policy must list any subcontractors or service providers that have access to customer data. This shows carriers you're transparent about data handling.",
        required: true,
        allowOther: true,
      },
      {
        id: "uses_affiliate_tracking",
        question: "Do you buy leads or get customer phone numbers from any outside sources?",
        type: "select",
        options: ["No — all leads come directly from my own forms", "Yes — I buy or receive leads from outside sources"],
        helperText: "WHY THIS MATTERS: This includes things like: buying lead lists from services like HomeAdvisor or Angi, getting phone numbers from partner referral programs, or using any service that sends you customer contact info you didn't collect yourself. If you text people whose numbers came from outside sources without their direct consent to YOUR business, carriers can shut down your messaging.",
        recommendationText: "For best approval odds, select 'No'. If you do buy leads, you must get fresh SMS consent from each person through your own compliant opt-in form before texting them.",
        required: true,
      },
    ],
  },

  // ─── SECTION 6: COMPLIANCE SPECIFICS ───
  {
    id: "compliance",
    title: "Compliance Specifics",
    description: "Legal details that determine which regulations apply to your policy.",
    questions: [
      {
        id: "collects_under_13",
        question: "Could anyone under 13 years old use your service or fill out your forms?",
        type: "select",
        options: [
          "No — our service is for adults/businesses only",
          "Possibly — minors could access our forms",
        ],
        helperText: "WHY THIS MATTERS: If anyone under 13 could submit data, your policy needs COPPA (Children's Online Privacy Protection Act) compliance language. Most B2B and professional services can select 'No' here.",
        required: true,
      },
      {
        id: "operates_in_california",
        question: "Do you have any customers in California?",
        type: "select",
        options: [
          "No — no California customers",
          "Yes — some customers are in California",
          "Yes — we're based in California",
          "I'm not sure",
        ],
        helperText: "WHY THIS MATTERS: If you have ANY California customers, your policy must include CCPA (California Consumer Privacy Act) rights. This includes the right to know what data is collected, the right to delete, and the right to opt out of data sales. When in doubt, select 'Yes' to be safe.",
        recommendationText: "When in doubt, select 'Yes — some customers are in California'. Including CCPA language doesn't hurt your application and protects you if you ever get California customers.",
        required: true,
      },
      {
        id: "business_state",
        question: "What state is your business registered in?",
        type: "select",
        options: [
          "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
          "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
          "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
          "New Hampshire", "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
          "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
          "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
          "West Virginia", "Wisconsin", "Wyoming", "Washington D.C.",
        ],
        helperText: "WHY THIS MATTERS: This determines the governing law section of your Terms & Conditions. Your terms will state that disputes are governed by the laws of this state.",
        required: true,
      },
    ],
  },

  // ─── SECTION 7: PLATFORM & TECHNICAL ───
  {
    id: "platform_technical",
    title: "Platform & Technical",
    description: "Details about the tools you use for texting. This helps us write accurate technical disclosures.",
    questions: [
      {
        id: "primary_sms_platform",
        question: "What is your primary SMS/CRM platform?",
        type: "select",
        options: [
          "GoHighLevel",
          "Twilio",
          "EZTexting",
          "SlickText",
          "SimpleTexting",
          "Textedly",
          "Salesmsg",
          "HubSpot",
          "Salesforce",
        ],
        helperText: "WHY THIS MATTERS: Your brand registration on this platform must match the business info in your documents exactly. We'll make sure the documents are formatted correctly for your A2P submission.",
        required: true,
        allowOther: true,
      },
      {
        id: "additional_sms_platforms",
        question: "Do you use any additional SMS platforms?",
        type: "select",
        options: [
          "No — only one platform",
          "Yes — I use additional platforms",
        ],
        helperText: "WHY THIS MATTERS: If you use multiple platforms, each one may need its own A2P registration. Your privacy policy should cover all platforms that send messages on your behalf.",
        required: true,
      },
      {
        id: "additional_platform_details",
        question: "Which additional SMS platforms do you use?",
        type: "multi-select",
        options: [
          "GoHighLevel",
          "Twilio",
          "EZTexting",
          "SlickText",
          "SimpleTexting",
          "Textedly",
          "Salesmsg",
          "HubSpot",
          "Salesforce",
        ],
        allowOther: true,
      },
      {
        id: "has_existing_policies",
        question: "Do you already have a Privacy Policy and Terms & Conditions on your website?",
        type: "select",
        options: [
          "No — I need new ones created from scratch",
          "Yes — but they need to be updated for A2P compliance",
          "Yes — but I want to replace them entirely",
        ],
        helperText: "WHY THIS MATTERS: If you select 'updated for A2P compliance', you can paste your existing documents below and we'll update them to include all the required SMS language. If you select 'replace entirely', we'll generate brand new ones from scratch.",
        required: true,
      },
      {
        id: "existing_privacy_policy",
        question: "Paste your existing Privacy Policy here (optional)",
        type: "textarea",
        placeholder: "Paste the full text of your current privacy policy...",
        helperText: "If you have an existing privacy policy you'd like us to update for A2P compliance, paste it here. We'll keep your existing language and add the required SMS/messaging sections. Leave blank to generate a new one from scratch.",
      },
      {
        id: "existing_terms",
        question: "Paste your existing Terms & Conditions here (optional)",
        type: "textarea",
        placeholder: "Paste the full text of your current terms & conditions...",
        helperText: "If you have existing terms & conditions you'd like us to update for A2P compliance, paste it here. We'll keep your existing language and add the required SMS/messaging sections. Leave blank to generate new ones from scratch.",
      },
    ],
  },

  // ─── SECTION 8: FINAL CONFIRMATIONS ───
  {
    id: "final_confirmations",
    title: "Final Confirmations",
    description: "A few quick confirmations to make sure everything is ready for submission.",
    questions: [
      {
        id: "info_matches_registration",
        question: "Does all the information you've entered match your brand registration exactly?",
        type: "select",
        options: [
          "Yes — everything matches",
          "No — I need to double-check some details",
        ],
        helperText: "CRITICAL: The #1 reason A2P applications get rejected is mismatched information. Your business name, address, phone, and EIN must match exactly between your platform's brand registration, your IRS records, and these documents. Double-check before proceeding.",
        required: true,
      },
      {
        id: "understands_consent_boxes",
        question: "Your forms need TWO separate unchecked consent checkboxes. Do you understand this requirement?",
        type: "select",
        options: [
          "Yes — I understand and my forms are set up correctly",
          "Yes — I understand but need to update my forms",
        ],
        helperText: "WHY THIS MATTERS: A2P 10DLC requires TWO consent checkboxes on every form that collects a phone number: (1) consent to receive marketing messages, and (2) consent to receive non-marketing/transactional messages. Both must be unchecked by default. Both must have clear disclosure language next to them.",
        required: true,
      },
      {
        id: "no_prechecked_consent",
        question: "Can you confirm none of your consent checkboxes are pre-checked?",
        type: "select",
        options: [
          "Yes — none are pre-checked",
          "I need to fix some first",
        ],
        helperText: "CRITICAL: Pre-checked consent boxes = automatic rejection. Every consent checkbox must require the user to actively check it themselves.",
        required: true,
      },
    ],
  },
];

export function getTotalQuestions(): number {
  return a2pComplianceQuestions.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}

export function getClientQuestions(): QuestionSection[] {
  return a2pComplianceQuestions
    .map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.clientFacing),
    }))
    .filter((section) => section.questions.length > 0);
}
