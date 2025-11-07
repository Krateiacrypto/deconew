-- Apply enhanced user structure migration
-- This includes kyc_level and investor tier fields

-- Add KYC level field
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS kyc_level TEXT DEFAULT 'level_1'
  CHECK (kyc_level IN ('level_1', 'level_2', 'level_3'));

-- Add investor tier field
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS investor_tier TEXT
  CHECK (investor_tier IN ('free', 'pro', 'institutional', NULL));

-- Add tier-related fields
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS minimum_investment DECIMAL(12,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS monthly_limit DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS trading_fee_rate DECIMAL(5,4) DEFAULT 0.0025,
  ADD COLUMN IF NOT EXISTS staking_multiplier DECIMAL(3,2) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS tier_upgraded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tier_benefits JSONB DEFAULT '{}';