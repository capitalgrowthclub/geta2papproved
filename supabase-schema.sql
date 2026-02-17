-- GetA2PApproved Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  stripe_customer_id TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  plan_type TEXT DEFAULT 'none' CHECK (plan_type IN ('none', 'single_credit', 'monthly_pro', 'annual_unlimited')),
  credits_remaining INTEGER DEFAULT 0,
  stripe_subscription_id TEXT,
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  projects_used_this_period INTEGER DEFAULT 0,
  period_reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'waiting_for_client', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questionnaire responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('privacy_policy', 'terms_conditions', 'a2p_compliance')),
  questions_answers JSONB NOT NULL DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, section)
);

-- Generated documents table
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('privacy_policy', 'terms_conditions')),
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client intake links table
CREATE TABLE IF NOT EXISTS client_intake_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('privacy_policy', 'terms_conditions', 'a2p_compliance')),
  token TEXT UNIQUE NOT NULL,
  client_name TEXT,
  client_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_project_id ON questionnaire_responses(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON generated_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_client_intake_token ON client_intake_links(token);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Policies: Allow service role full access (our API routes use service role key)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true);
CREATE POLICY "Service role full access" ON projects FOR ALL USING (true);
CREATE POLICY "Service role full access" ON questionnaire_responses FOR ALL USING (true);
CREATE POLICY "Service role full access" ON generated_documents FOR ALL USING (true);

ALTER TABLE client_intake_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON client_intake_links FOR ALL USING (true);
