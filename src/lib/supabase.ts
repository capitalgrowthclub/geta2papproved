import { createClient } from "@supabase/supabase-js";

// Lazy-initialized clients to avoid build-time errors when env vars aren't set
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side client with service role key for admin operations
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Database types
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  stripe_customer_id: string | null;
  is_paid: boolean;
  plan_type: "none" | "single_credit" | "monthly_pro" | "annual_unlimited";
  credits_remaining: number;
  stripe_subscription_id: string | null;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  projects_used_this_period: number;
  period_reset_at: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  business_name: string;
  status: "draft" | "waiting_for_client" | "in_progress" | "completed" | "error";
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireResponse {
  id: string;
  project_id: string;
  section: "privacy_policy" | "terms_conditions" | "a2p_compliance";
  questions_answers: Record<string, string>;
  completed: boolean;
  created_at: string;
}

export interface ClientIntakeLink {
  id: string;
  project_id: string;
  section: "privacy_policy" | "terms_conditions" | "a2p_compliance";
  token: string;
  client_name: string | null;
  client_email: string | null;
  status: "pending" | "submitted";
  created_at: string;
  submitted_at: string | null;
}

export interface GeneratedDocument {
  id: string;
  project_id: string;
  type: "privacy_policy" | "terms_conditions" | "submission_language";
  content: string;
  version: number;
  created_at: string;
}
