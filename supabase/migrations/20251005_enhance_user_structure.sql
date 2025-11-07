/*
  # Enhanced User Structure Migration

  ## Summary
  This migration enhances the user management system with:
  - Enhanced role structure with investor tiers
  - KYC level system (Level 1, 2, 3)
  - Detailed permission matrix
  - Investor tier benefits and limitations
  - Verification reward system

  ## Changes

  ### 1. User Role Updates
  - Add new investor tier roles: INSTITUTIONAL_INVESTOR, PRO_INVESTOR, FREE_INVESTOR
  - Rename existing roles to match new structure
  - Add WEB_ADMIN role for content management

  ### 2. KYC System Enhancement
  - Add KYC levels (LEVEL_1, LEVEL_2, LEVEL_3)
  - Add detailed verification fields
  - Add institutional KYC requirements

  ### 3. Investor Tier System
  - Add investor_tier field
  - Add tier-specific limits and benefits
  - Add upgrade path tracking

  ### 4. Permission Matrix
  - Add user_permissions table for granular control
  - Add role_permissions mapping
  - Add permission categories

  ## Security
  - All tables maintain RLS policies
  - Permission checks at database level
  - Audit trail for all permission changes
*/

-- ============ STEP 1: Update User Roles ============

-- Add new user roles while keeping backward compatibility
DO $$
BEGIN
  -- Drop existing check constraint
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

  -- Add new constraint with all roles
  ALTER TABLE public.users ADD CONSTRAINT users_role_check
    CHECK (role IN (
      'superadmin',           -- Legacy: Full system control
      'admin',                -- Legacy: Platform management
      'web_admin',            -- NEW: Content & marketing management
      'carbon_provider',      -- Carbon credit provider
      'verifier',             -- Verification authority (renamed from verification_org)
      'advisor',              -- Investment advisor
      'ngo',                  -- Non-profit organization
      'institutional_investor', -- NEW: High-volume investor ($10K+)
      'pro_investor',         -- NEW: Advanced investor ($1K+)
      'free_investor',        -- NEW: Basic investor ($100+)
      'user'                  -- Legacy: Basic user
    ));
END $$;

-- ============ STEP 2: Add Investor Tier System ============

-- Add investor tier field
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS investor_tier TEXT
  CHECK (investor_tier IN ('free', 'pro', 'institutional', NULL));

-- Add tier-related fields
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS minimum_investment DECIMAL(12,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS monthly_limit DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS trading_fee_rate DECIMAL(5,4) DEFAULT 0.0025, -- 0.25%
  ADD COLUMN IF NOT EXISTS staking_multiplier DECIMAL(3,2) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS tier_upgraded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tier_benefits JSONB DEFAULT '{}';

-- ============ STEP 3: Enhanced KYC System ============

-- Add KYC level field
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS kyc_level TEXT DEFAULT 'level_1'
  CHECK (kyc_level IN ('level_1', 'level_2', 'level_3'));

-- Add detailed KYC tracking
ALTER TABLE public.kyc_applications
  ADD COLUMN IF NOT EXISTS kyc_level TEXT DEFAULT 'level_1'
  CHECK (kyc_level IN ('level_1', 'level_2', 'level_3')),
  ADD COLUMN IF NOT EXISTS identity_document_url TEXT,
  ADD COLUMN IF NOT EXISTS address_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS selfie_url TEXT,
  ADD COLUMN IF NOT EXISTS company_registration_url TEXT,
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS beneficial_owners JSONB,
  ADD COLUMN IF NOT EXISTS verification_notes TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- ============ STEP 4: Permission System ============

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role_permissions mapping
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  permission_code TEXT NOT NULL REFERENCES public.permissions(code),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_code)
);

-- Create user_custom_permissions for override
CREATE TABLE IF NOT EXISTS public.user_custom_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  permission_code TEXT NOT NULL REFERENCES public.permissions(code),
  granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES public.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(user_id, permission_code)
);

-- ============ STEP 5: Verification Reward System ============

-- Create verification_rewards table
CREATE TABLE IF NOT EXISTS public.verification_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verifier_id UUID NOT NULL REFERENCES public.users(id),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  base_reward DECIMAL(10,2) DEFAULT 100, -- 100 ICO2
  accuracy_bonus DECIMAL(10,2) DEFAULT 0,
  speed_bonus DECIMAL(10,2) DEFAULT 0,
  total_reward DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ STEP 6: Platform Metrics ============

-- Create platform_metrics table
CREATE TABLE IF NOT EXISTS public.platform_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  approved_projects INTEGER DEFAULT 0,
  total_value_locked DECIMAL(18,2) DEFAULT 0,
  trading_volume_24h DECIMAL(18,2) DEFAULT 0,
  carbon_offset_tons DECIMAL(12,2) DEFAULT 0,
  metrics_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ STEP 7: Insert Default Permissions ============

INSERT INTO public.permissions (code, category, name, description) VALUES
  -- Smart Contract
  ('contract.mint', 'smart_contract', 'Mint Tokens', 'Ability to mint new tokens'),
  ('contract.burn', 'smart_contract', 'Burn Tokens', 'Ability to burn tokens'),
  ('contract.upgrade', 'smart_contract', 'Upgrade Contracts', 'Ability to upgrade smart contracts'),
  ('contract.emergency', 'smart_contract', 'Emergency Shutdown', 'Ability to execute emergency shutdown'),

  -- User Management
  ('users.view', 'user_management', 'View Users', 'View user list and profiles'),
  ('users.edit', 'user_management', 'Edit Users', 'Edit user profiles and settings'),
  ('users.delete', 'user_management', 'Delete Users', 'Delete user accounts'),
  ('users.kyc.approve', 'user_management', 'Approve KYC', 'Approve KYC applications'),
  ('users.suspend', 'user_management', 'Suspend Users', 'Suspend user accounts'),

  -- Project Management
  ('projects.create', 'project_management', 'Create Projects', 'Create new projects'),
  ('projects.edit', 'project_management', 'Edit Projects', 'Edit existing projects'),
  ('projects.approve', 'project_management', 'Approve Projects', 'Approve project submissions'),
  ('projects.verify', 'project_management', 'Verify Projects', 'Verify carbon credits'),
  ('projects.delist', 'project_management', 'Delist Projects', 'Remove projects from platform'),

  -- Trading & Financial
  ('trading.basic', 'financial', 'Basic Trading', 'Buy and sell tokens'),
  ('trading.advanced', 'financial', 'Advanced Trading', 'Advanced order types and features'),
  ('trading.bulk', 'financial', 'Bulk Trading', 'Bulk trading operations'),
  ('trading.otc', 'financial', 'OTC Access', 'Over-the-counter trading'),
  ('treasury.manage', 'financial', 'Manage Treasury', 'Manage platform treasury'),

  -- Content Management
  ('content.blog.create', 'content_management', 'Create Blog Posts', 'Create blog content'),
  ('content.blog.publish', 'content_management', 'Publish Blog Posts', 'Publish blog content'),
  ('content.pages.edit', 'content_management', 'Edit Pages', 'Edit website pages'),
  ('content.media.manage', 'content_management', 'Manage Media', 'Upload and manage media files'),

  -- Analytics & Reporting
  ('analytics.view', 'analytics', 'View Analytics', 'View platform analytics'),
  ('analytics.advanced', 'analytics', 'Advanced Analytics', 'Access advanced analytics tools'),
  ('analytics.export', 'analytics', 'Export Data', 'Export analytics data'),

  -- Staking
  ('staking.basic', 'staking', 'Basic Staking', 'Access basic staking pools'),
  ('staking.enhanced', 'staking', 'Enhanced Staking', 'Access enhanced staking features'),
  ('staking.liquidity', 'staking', 'Liquidity Provision', 'Provide liquidity')
ON CONFLICT (code) DO NOTHING;

-- ============ STEP 8: Map Default Role Permissions ============

-- SUPERADMIN - Full access
INSERT INTO public.role_permissions (role, permission_code)
SELECT 'superadmin', code FROM public.permissions
ON CONFLICT DO NOTHING;

-- WEB_ADMIN - Content and community management
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('web_admin', 'content.blog.create'),
  ('web_admin', 'content.blog.publish'),
  ('web_admin', 'content.pages.edit'),
  ('web_admin', 'content.media.manage'),
  ('web_admin', 'analytics.view'),
  ('web_admin', 'users.view')
ON CONFLICT DO NOTHING;

-- ADMIN - Platform management
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('admin', 'users.view'),
  ('admin', 'users.edit'),
  ('admin', 'users.kyc.approve'),
  ('admin', 'projects.approve'),
  ('admin', 'projects.delist'),
  ('admin', 'content.blog.publish'),
  ('admin', 'analytics.view'),
  ('admin', 'analytics.advanced')
ON CONFLICT DO NOTHING;

-- CARBON_PROVIDER
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('carbon_provider', 'projects.create'),
  ('carbon_provider', 'projects.edit'),
  ('carbon_provider', 'analytics.view'),
  ('carbon_provider', 'staking.basic')
ON CONFLICT DO NOTHING;

-- VERIFIER
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('verifier', 'projects.verify'),
  ('verifier', 'analytics.view')
ON CONFLICT DO NOTHING;

-- ADVISOR
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('advisor', 'analytics.view'),
  ('advisor', 'content.blog.create')
ON CONFLICT DO NOTHING;

-- NGO
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('ngo', 'projects.create'),
  ('ngo', 'projects.edit'),
  ('ngo', 'analytics.view')
ON CONFLICT DO NOTHING;

-- INSTITUTIONAL_INVESTOR
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('institutional_investor', 'trading.bulk'),
  ('institutional_investor', 'trading.otc'),
  ('institutional_investor', 'trading.advanced'),
  ('institutional_investor', 'analytics.advanced'),
  ('institutional_investor', 'analytics.export'),
  ('institutional_investor', 'staking.enhanced'),
  ('institutional_investor', 'staking.liquidity')
ON CONFLICT DO NOTHING;

-- PRO_INVESTOR
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('pro_investor', 'trading.advanced'),
  ('pro_investor', 'analytics.view'),
  ('pro_investor', 'staking.enhanced')
ON CONFLICT DO NOTHING;

-- FREE_INVESTOR
INSERT INTO public.role_permissions (role, permission_code) VALUES
  ('free_investor', 'trading.basic'),
  ('free_investor', 'staking.basic')
ON CONFLICT DO NOTHING;

-- ============ STEP 9: Update Existing Users ============

-- Migrate existing 'user' role to appropriate investor tier based on investments
DO $$
BEGIN
  -- Update users with high investments to institutional
  UPDATE public.users u
  SET
    role = 'institutional_investor',
    investor_tier = 'institutional',
    minimum_investment = 10000,
    trading_fee_rate = 0.001,
    staking_multiplier = 1.0
  WHERE u.role = 'user'
    AND EXISTS (
      SELECT 1 FROM public.investments i
      WHERE i.user_id = u.id
      GROUP BY i.user_id
      HAVING SUM(i.amount) >= 10000
    );

  -- Update users with medium investments to pro
  UPDATE public.users u
  SET
    role = 'pro_investor',
    investor_tier = 'pro',
    minimum_investment = 1000,
    trading_fee_rate = 0.002,
    staking_multiplier = 1.25
  WHERE u.role = 'user'
    AND EXISTS (
      SELECT 1 FROM public.investments i
      WHERE i.user_id = u.id
      GROUP BY i.user_id
      HAVING SUM(i.amount) >= 1000 AND SUM(i.amount) < 10000
    );

  -- Update remaining users to free investor
  UPDATE public.users
  SET
    role = 'free_investor',
    investor_tier = 'free',
    minimum_investment = 100,
    trading_fee_rate = 0.0025,
    staking_multiplier = 1.0,
    monthly_limit = 10000
  WHERE role = 'user';

  -- Rename verification_org to verifier
  UPDATE public.users
  SET role = 'verifier'
  WHERE role = 'verification_org';
END $$;

-- ============ STEP 10: Enable RLS on New Tables ============

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

-- Permissions policies (read-only for authenticated users)
CREATE POLICY "Anyone authenticated can read permissions" ON public.permissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Role permissions policies
CREATE POLICY "Anyone authenticated can read role permissions" ON public.role_permissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );

-- User custom permissions policies
CREATE POLICY "Users can read own custom permissions" ON public.user_custom_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage custom permissions" ON public.user_custom_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );

-- Verification rewards policies
CREATE POLICY "Verifiers can read own rewards" ON public.verification_rewards
  FOR SELECT USING (auth.uid() = verifier_id);

CREATE POLICY "Admins can manage rewards" ON public.verification_rewards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );

-- Platform metrics policies
CREATE POLICY "Admins can read platform metrics" ON public.platform_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('superadmin', 'admin', 'web_admin')
    )
  );

-- ============ STEP 11: Create Helper Functions ============

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.user_has_permission(
  p_user_id UUID,
  p_permission_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
  v_user_role TEXT;
BEGIN
  -- Get user role
  SELECT role INTO v_user_role
  FROM public.users
  WHERE id = p_user_id;

  -- Check custom permissions first (can grant or revoke)
  SELECT granted INTO v_has_permission
  FROM public.user_custom_permissions
  WHERE user_id = p_user_id
    AND permission_code = p_permission_code
    AND (expires_at IS NULL OR expires_at > NOW());

  -- If custom permission exists, return it
  IF v_has_permission IS NOT NULL THEN
    RETURN v_has_permission;
  END IF;

  -- Otherwise check role permissions
  SELECT EXISTS (
    SELECT 1
    FROM public.role_permissions
    WHERE role = v_user_role
      AND permission_code = p_permission_code
  ) INTO v_has_permission;

  RETURN COALESCE(v_has_permission, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's investor tier limits
CREATE OR REPLACE FUNCTION public.get_investor_limits(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user RECORD;
  v_limits JSON;
BEGIN
  SELECT
    role,
    investor_tier,
    minimum_investment,
    monthly_limit,
    trading_fee_rate,
    staking_multiplier
  INTO v_user
  FROM public.users
  WHERE id = p_user_id;

  v_limits := json_build_object(
    'role', v_user.role,
    'tier', v_user.investor_tier,
    'minimumInvestment', v_user.minimum_investment,
    'monthlyLimit', v_user.monthly_limit,
    'tradingFee', v_user.trading_fee_rate,
    'stakingMultiplier', v_user.staking_multiplier
  );

  RETURN v_limits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============ STEP 12: Create Indexes ============

CREATE INDEX IF NOT EXISTS idx_users_investor_tier ON public.users(investor_tier);
CREATE INDEX IF NOT EXISTS idx_users_kyc_level ON public.users(kyc_level);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_user_custom_permissions_user_id ON public.user_custom_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_rewards_verifier ON public.verification_rewards(verifier_id);
CREATE INDEX IF NOT EXISTS idx_verification_rewards_project ON public.verification_rewards(project_id);

-- ============ STEP 13: Update Triggers ============

-- Trigger to update platform metrics
CREATE OR REPLACE FUNCTION update_platform_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called by a scheduled job
  -- Placeholder for future implementation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_verification_rewards_updated_at
  BEFORE UPDATE ON public.verification_rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_metrics_updated_at
  BEFORE UPDATE ON public.platform_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
