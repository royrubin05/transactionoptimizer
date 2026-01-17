-- Supabase Database Schema for SubTrack
-- Run this in the Supabase SQL Editor to set up your tables

-- Linked accounts (credit cards, app stores, etc.)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- For multi-user support later
  plaid_account_id TEXT UNIQUE,
  plaid_access_token TEXT,
  name TEXT NOT NULL,           -- "Chase Sapphire", "Apple App Store"
  institution TEXT NOT NULL,    -- "Chase", "Apple"
  type TEXT NOT NULL,           -- "credit", "debit", "app_store"
  mask TEXT,                    -- Last 4 digits (optional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw transactions from all sources
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  external_id TEXT,             -- Plaid transaction ID or other external ID
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  merchant_name TEXT,
  normalized_name TEXT,         -- AI-cleaned name
  category TEXT[],              -- Source categories (from Plaid, etc.)
  ai_category TEXT,             -- AI-refined category
  pending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(account_id, external_id)
);

-- Detected recurring subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  merchant_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  category TEXT,
  typical_amount DECIMAL(10,2),
  billing_cycle TEXT DEFAULT 'monthly', -- "monthly", "yearly", "weekly"
  last_charged DATE,
  next_expected DATE,
  confidence DECIMAL(3,2),      -- AI confidence score (0-1)
  status TEXT DEFAULT 'active', -- "active", "cancelled", "paused"
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price anomalies and alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,           -- "price_increase", "price_decrease", "unexpected_charge", "missed"
  message TEXT NOT NULL,
  previous_amount DECIMAL(10,2),
  new_amount DECIMAL(10,2),
  percent_change DECIMAL(5,2),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync history for n8n and scheduling
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,         -- "sync_all", "detect_subscriptions", etc.
  status TEXT NOT NULL,         -- "success", "error", "partial"
  accounts_synced INT DEFAULT 0,
  transactions_fetched INT DEFAULT 0,
  subscriptions_detected INT DEFAULT 0,
  anomalies_found INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_subscriptions_account ON subscriptions(account_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Row Level Security (for future multi-user support)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
