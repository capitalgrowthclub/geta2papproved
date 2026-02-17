import { QuestionSection } from "./privacy-policy";

export const termsConditionsQuestions: QuestionSection[] = [
  {
    id: "service_info",
    title: "Service Description",
    description: "Describe the service your business provides.",
    questions: [
      {
        id: "service_description",
        question: "Describe the products or services your business provides.",
        type: "textarea",
        placeholder: "e.g., We provide an online platform for scheduling appointments and sending automated SMS reminders to customers...",
        required: true,
        clientFacing: true,
      },
      {
        id: "service_availability",
        question: "Is your service available 24/7 or are there specific operating hours?",
        type: "select",
        options: ["Available 24/7", "Business hours only (Mon-Fri)", "Extended hours (Mon-Sat)", "Variable hours"],
        required: true,
        clientFacing: true,
      },
      {
        id: "eligibility",
        question: "Who is eligible to use your service?",
        type: "textarea",
        placeholder: "e.g., Must be 18+ years old, must be a US resident, must have a valid business...",
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "user_accounts",
    title: "User Accounts & Registration",
    description: "Terms related to user account creation and management.",
    questions: [
      {
        id: "account_required",
        question: "Is account registration required to use your service?",
        type: "select",
        options: ["Yes, account required", "No, guests can use the service", "Optional — enhanced features with account"],
        required: true,
        clientFacing: true,
      },
      {
        id: "account_responsibilities",
        question: "What are the user's responsibilities for their account?",
        type: "multi-select",
        options: ["Keep login credentials secure", "Provide accurate information", "Notify us of unauthorized access", "One account per person", "Keep account information up to date"],
        required: true,
        clientFacing: true,
      },
      {
        id: "account_termination",
        question: "Under what circumstances can you terminate a user's account?",
        type: "multi-select",
        options: ["Violation of terms of service", "Fraudulent activity", "Non-payment", "Inactive for extended period", "Abusive behavior", "At our discretion with notice"],
        required: true,
      },
    ],
  },
  {
    id: "messaging_terms",
    title: "SMS & Messaging Terms",
    description: "Terms specific to your SMS messaging service — essential for A2P compliance.",
    questions: [
      {
        id: "messaging_consent",
        question: "How do users consent to receive messages?",
        type: "textarea",
        placeholder: "Describe the consent mechanism (e.g., checking a box during registration, texting a keyword to a number)...",
        helperText: "This must match what you described in the privacy policy questionnaire.",
        required: true,
        clientFacing: true,
      },
      {
        id: "messaging_costs",
        question: "Are there any messaging costs to the user?",
        type: "select",
        options: ["No — messages are free to receive", "Standard messaging rates may apply", "Data rates may apply", "Premium messaging rates apply"],
        required: true,
        clientFacing: true,
      },
      {
        id: "messaging_disclaimer",
        question: "What carriers/networks do you support?",
        type: "select",
        options: ["All major US carriers", "All major US and Canadian carriers", "All carriers (international)", "Select carriers only"],
        required: true,
        clientFacing: true,
      },
      {
        id: "messaging_content_type",
        question: "What type of content will your messages contain?",
        type: "multi-select",
        options: ["Transactional notifications", "Marketing/promotional content", "Account security alerts", "Appointment/scheduling info", "Order/delivery updates", "Customer support responses", "Links to website/app"],
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "payment_terms",
    title: "Payment & Pricing",
    description: "Terms related to payments, refunds, and pricing.",
    questions: [
      {
        id: "payment_model",
        question: "What is your payment/pricing model?",
        type: "select",
        options: ["Free service", "One-time purchase", "Monthly subscription", "Annual subscription", "Pay-per-use", "Freemium (free + paid tiers)"],
        required: true,
        clientFacing: true,
      },
      {
        id: "refund_policy",
        question: "What is your refund policy?",
        type: "textarea",
        placeholder: "e.g., 30-day money-back guarantee, no refunds after service is rendered, pro-rated refunds...",
        required: true,
        clientFacing: true,
      },
      {
        id: "price_changes",
        question: "How will you handle price changes?",
        type: "select",
        options: ["30-day advance notice", "Notice at next billing cycle", "Prices may change at any time", "Prices are locked for current subscribers"],
        required: true,
      },
    ],
  },
  {
    id: "liability",
    title: "Liability & Disclaimers",
    description: "Limitations on your business liability.",
    questions: [
      {
        id: "service_warranty",
        question: "What warranties do you provide for your service?",
        type: "select",
        options: ["Service provided 'as is' — no warranties", "We guarantee 99.9% uptime", "We guarantee service quality", "Limited warranty with specific terms"],
        required: true,
      },
      {
        id: "liability_limit",
        question: "How do you want to limit your liability?",
        type: "select",
        options: ["Limited to amount paid by user in last 12 months", "Limited to amount paid for specific service", "Maximum liability cap (e.g., $500)", "No liability for indirect/consequential damages"],
        required: true,
      },
      {
        id: "indemnification",
        question: "Do you require users to indemnify your business?",
        type: "select",
        options: ["Yes — users indemnify against misuse of service", "Yes — full indemnification clause", "No indemnification required"],
        required: true,
      },
    ],
  },
  {
    id: "disputes",
    title: "Disputes & Governing Law",
    description: "How disputes will be resolved and which laws govern the agreement.",
    questions: [
      {
        id: "governing_law",
        question: "Which state's laws will govern this agreement?",
        type: "text",
        placeholder: "e.g., State of California",
        required: true,
      },
      {
        id: "dispute_resolution",
        question: "How will disputes be resolved?",
        type: "select",
        options: ["Binding arbitration", "Mediation first, then arbitration", "Litigation in courts", "Informal negotiation first, then arbitration"],
        required: true,
      },
      {
        id: "class_action_waiver",
        question: "Do you want to include a class action waiver?",
        type: "select",
        options: ["Yes", "No"],
        required: true,
      },
    ],
  },
];

export function getTotalTermsQuestions(): number {
  return termsConditionsQuestions.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}
