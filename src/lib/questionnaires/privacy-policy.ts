export interface Question {
  id: string;
  question: string;
  type: "text" | "textarea" | "select" | "multi-select";
  placeholder?: string;
  helperText?: string;
  options?: string[];
  required?: boolean;
  clientFacing?: boolean;
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const privacyPolicyQuestions: QuestionSection[] = [
  {
    id: "business_info",
    title: "Business Information",
    description: "Basic details about your business that will appear in the privacy policy.",
    questions: [
      {
        id: "business_legal_name",
        question: "What is the full legal name of your business?",
        type: "text",
        placeholder: "e.g., Acme Corporation LLC",
        required: true,
        clientFacing: true,
      },
      {
        id: "business_type",
        question: "What type of business entity is this?",
        type: "select",
        options: ["Sole Proprietorship", "LLC", "Corporation", "Partnership", "Non-Profit", "Other"],
        required: true,
        clientFacing: true,
      },
      {
        id: "business_website",
        question: "What is your business website URL?",
        type: "text",
        placeholder: "e.g., https://www.example.com",
        required: true,
        clientFacing: true,
      },
      {
        id: "business_address",
        question: "What is your business mailing address?",
        type: "textarea",
        placeholder: "Full street address, city, state, ZIP code",
        required: true,
        clientFacing: true,
      },
      {
        id: "contact_email",
        question: "What is the primary contact email for privacy inquiries?",
        type: "text",
        placeholder: "e.g., privacy@example.com",
        required: true,
        clientFacing: true,
      },
      {
        id: "contact_phone",
        question: "What is your business phone number?",
        type: "text",
        placeholder: "e.g., (555) 123-4567",
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "data_collection",
    title: "Data Collection",
    description: "What personal information your business collects from users.",
    questions: [
      {
        id: "data_types_collected",
        question: "What types of personal data do you collect?",
        type: "multi-select",
        options: [
          "Full name",
          "Email address",
          "Phone number",
          "Mailing address",
          "Date of birth",
          "Payment/billing information",
          "IP address",
          "Device information",
          "Location data",
          "Cookies/tracking data",
          "Social media profiles",
          "Employment information",
          "Health information",
        ],
        required: true,
        clientFacing: true,
      },
      {
        id: "collection_methods",
        question: "How do you collect this personal data?",
        type: "multi-select",
        options: [
          "Website forms",
          "Account registration",
          "SMS/text message opt-in",
          "Phone calls",
          "In-person interactions",
          "Third-party integrations",
          "Cookies and tracking technologies",
          "Mobile app",
          "Email sign-up",
        ],
        required: true,
        clientFacing: true,
      },
      {
        id: "data_purpose",
        question: "What are the primary purposes for collecting this data?",
        type: "textarea",
        placeholder: "Describe why you collect each type of data and how it's used in your business operations...",
        helperText: "Be specific — this is critical for A2P compliance.",
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "sms_messaging",
    title: "SMS & Messaging",
    description: "Details about your SMS/text messaging practices — critical for A2P 10DLC approval.",
    questions: [
      {
        id: "sms_purpose",
        question: "What is the primary purpose of your SMS messaging?",
        type: "multi-select",
        options: [
          "Appointment reminders",
          "Order/delivery notifications",
          "Account alerts & security",
          "Marketing & promotions",
          "Customer support",
          "Two-factor authentication",
          "Payment reminders",
          "Service updates",
        ],
        required: true,
        clientFacing: true,
      },
      {
        id: "message_frequency",
        question: "How frequently will users receive messages?",
        type: "select",
        options: [
          "One-time only (transactional)",
          "Up to 5 messages per month",
          "Up to 15 messages per month",
          "Up to 30 messages per month",
          "Variable — depends on user activity",
        ],
        required: true,
        clientFacing: true,
      },
      {
        id: "optin_method",
        question: "How do users opt in to receive SMS messages?",
        type: "textarea",
        placeholder: "Describe your opt-in process (e.g., web form checkbox, keyword text-in, verbal consent)...",
        helperText: "Carriers require clear, documented opt-in consent for A2P messaging.",
        required: true,
        clientFacing: true,
      },
      {
        id: "optout_method",
        question: "How can users opt out of SMS messages?",
        type: "textarea",
        placeholder: "e.g., Reply STOP to any message, contact support, manage preferences in account settings...",
        helperText: "Users must be able to easily opt out. STOP keyword support is required.",
        required: true,
        clientFacing: true,
      },
      {
        id: "sample_messages",
        question: "Provide 2-3 examples of typical messages you will send.",
        type: "textarea",
        placeholder: "e.g., 'Hi {name}, your appointment is tomorrow at 3pm. Reply YES to confirm or call us to reschedule.'",
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "data_sharing",
    title: "Data Sharing & Third Parties",
    description: "Who you share user data with and why.",
    questions: [
      {
        id: "third_party_sharing",
        question: "Do you share personal data with third parties?",
        type: "select",
        options: ["Yes", "No"],
        required: true,
        clientFacing: true,
      },
      {
        id: "third_party_types",
        question: "If yes, what types of third parties do you share data with?",
        type: "multi-select",
        options: [
          "SMS/messaging service providers",
          "Payment processors",
          "Analytics services",
          "Advertising platforms",
          "CRM/email marketing tools",
          "Cloud hosting providers",
          "Business partners/affiliates",
          "Legal/compliance services",
          "Government agencies (when required)",
        ],
        clientFacing: true,
      },
      {
        id: "data_sale",
        question: "Do you sell personal data to third parties?",
        type: "select",
        options: ["No, we do not sell personal data", "Yes, we may sell certain data"],
        required: true,
        clientFacing: true,
      },
    ],
  },
  {
    id: "data_security",
    title: "Data Security & Retention",
    description: "How you protect and manage stored personal data.",
    questions: [
      {
        id: "security_measures",
        question: "What security measures do you use to protect personal data?",
        type: "multi-select",
        options: [
          "SSL/TLS encryption",
          "Data encryption at rest",
          "Access controls & authentication",
          "Regular security audits",
          "Firewall protection",
          "Employee security training",
          "Two-factor authentication",
          "Data backup procedures",
        ],
        required: true,
      },
      {
        id: "data_retention",
        question: "How long do you retain personal data?",
        type: "select",
        options: [
          "As long as the account is active",
          "Up to 1 year after last interaction",
          "Up to 3 years",
          "Up to 5 years",
          "As required by law",
          "Until user requests deletion",
        ],
        required: true,
      },
      {
        id: "user_rights",
        question: "What rights do users have regarding their data?",
        type: "multi-select",
        options: [
          "Access their data",
          "Correct inaccurate data",
          "Delete their data",
          "Export/download their data",
          "Opt out of data sale",
          "Withdraw consent",
          "Lodge a complaint",
        ],
        required: true,
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & Legal",
    description: "Regulatory compliance details for your privacy policy.",
    questions: [
      {
        id: "target_regions",
        question: "Where are your users located?",
        type: "multi-select",
        options: [
          "United States only",
          "California (CCPA applies)",
          "European Union (GDPR applies)",
          "Canada",
          "United Kingdom",
          "International/worldwide",
        ],
        required: true,
      },
      {
        id: "children_data",
        question: "Does your service target or collect data from children under 13?",
        type: "select",
        options: ["No", "Yes"],
        required: true,
      },
      {
        id: "policy_updates",
        question: "How will you notify users of privacy policy changes?",
        type: "select",
        options: [
          "Email notification",
          "Website banner/notice",
          "Both email and website notice",
          "Update posted on website only",
        ],
        required: true,
      },
    ],
  },
];

export function getTotalQuestions(): number {
  return privacyPolicyQuestions.reduce(
    (total, section) => total + section.questions.length,
    0
  );
}
