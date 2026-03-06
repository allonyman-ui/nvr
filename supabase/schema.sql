-- Chase SaaS — Supabase Schema
-- Run this in the Supabase SQL editor

-- ─────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                 TEXT NOT NULL,
  name                  TEXT,
  business_name         TEXT,
  logo_url              TEXT,
  email_signature       TEXT DEFAULT '',
  reply_to_email        TEXT,
  stripe_customer_id    TEXT,
  subscription_status   TEXT DEFAULT 'free',  -- free | trialing | active | past_due | canceled
  subscription_id       TEXT,
  trial_ends_at         TIMESTAMPTZ,
  onboarding_completed  BOOLEAN DEFAULT false,
  signup_source         TEXT,                        -- utm_source / referrer / 'direct'
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Migration (run in Supabase SQL editor if table already exists):
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source TEXT;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────
-- CLIENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  default_rate DECIMAL(10, 2),
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own clients"
  ON clients FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- INVOICES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id                 UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number            TEXT NOT NULL,
  status                    TEXT DEFAULT 'draft',  -- draft | sent | overdue | paid | cancelled
  total_amount              DECIMAL(10, 2) DEFAULT 0,
  due_date                  DATE,
  notes                     TEXT,
  stripe_payment_link       TEXT,
  stripe_payment_link_id    TEXT,
  stripe_payment_intent_id  TEXT,
  sent_at                   TIMESTAMPTZ,
  paid_at                   TIMESTAMPTZ,
  created_at                TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own invoices"
  ON invoices FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- INVOICE ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id   UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description  TEXT NOT NULL,
  quantity     DECIMAL(10, 2) DEFAULT 1,
  rate         DECIMAL(10, 2) DEFAULT 0,
  amount       DECIMAL(10, 2) DEFAULT 0,
  sort_order   INTEGER DEFAULT 0
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own invoice items"
  ON invoice_items FOR ALL USING (
    auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id)
  );


-- ─────────────────────────────────────────
-- CHASE SEQUENCES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chase_sequences (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id       UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  step_number      INTEGER NOT NULL,
  days_after_sent  INTEGER,               -- # days after invoice sent to fire this step
  scheduled_date   DATE NOT NULL,
  sent_at          TIMESTAMPTZ,
  status           TEXT DEFAULT 'pending', -- pending | sent | cancelled | skipped
  email_subject    TEXT NOT NULL,
  email_body       TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Migration: add days_after_sent if it doesn't exist (safe to run multiple times)
DO $$ BEGIN
  ALTER TABLE chase_sequences ADD COLUMN days_after_sent INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

ALTER TABLE chase_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chase sequences"
  ON chase_sequences FOR ALL USING (
    auth.uid() = (SELECT user_id FROM invoices WHERE id = invoice_id)
  );


-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS chase_sequences_invoice_id_idx ON chase_sequences(invoice_id);
CREATE INDEX IF NOT EXISTS chase_sequences_status_date_idx ON chase_sequences(status, scheduled_date);
