/*
  # Enhanced Sustainability and Carbon Impact Features
  
  ## Summary
  This migration adds comprehensive sustainability tracking, carbon impact metrics,
  and enhanced features for the DECARBONIZE platform.
  
  ## New Tables
  
  ### 1. project_verification_steps
  - Tracks detailed verification workflow stages
  - Links to verifiers and includes evidence/notes
  - Status tracking for each verification stage
  
  ### 2. carbon_certificates
  - Blockchain-backed carbon offset certificates
  - Links to projects and users
  - Includes IPFS hash for immutable storage
  - Tracks certificate validity and retirement status
  
  ### 3. user_carbon_footprint
  - Individual carbon footprint tracking
  - Monthly aggregated data
  - Links investments to offset impact
  - Gamification metrics (badges, achievements)
  
  ### 4. green_bonds
  - Tokenized green bonds for institutional investors
  - Maturity tracking and yield calculations
  - Project portfolio backing
  
  ### 5. advisor_earnings
  - Commission tracking for advisors
  - Links to projects and consultations
  - Payment status and history
  
  ## Enhanced Tables
  
  - carbon_impact_tracking: Additional metrics and satellite data integration
  - verification_rewards: Enhanced accuracy and impact scoring
  - ngo_donations: Tax receipt generation and recurring donations
  
  ## Security
  - All new tables have RLS enabled
  - Role-based access policies
  - Audit trail integration
  
  ## Performance
  - Optimized indexes for common queries
  - Materialized views for aggregated metrics
*/

-- ============ PROJECT VERIFICATION STEPS ============

CREATE TABLE IF NOT EXISTS public.project_verification_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  verifier_id UUID NOT NULL REFERENCES public.users(id),
  step_number INTEGER NOT NULL CHECK (step_number > 0),
  step_name TEXT NOT NULL CHECK (step_name IN (
    'document_review',
    'ai_prescreening',
    'technical_audit',
    'onsite_inspection',
    'certificate_minting',
    'monitoring_setup'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected', 'requires_revision')),
  evidence_urls TEXT[],
  notes TEXT,
  ai_confidence_score DECIMAL(5,4) CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, step_number)
);

-- ============ CARBON CERTIFICATES ============

CREATE TABLE IF NOT EXISTS public.carbon_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  carbon_tons DECIMAL(12,4) NOT NULL CHECK (carbon_tons > 0),
  blockchain_hash TEXT UNIQUE NOT NULL,
  ipfs_hash TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  retired BOOLEAN DEFAULT FALSE,
  retired_at TIMESTAMPTZ,
  retirement_reason TEXT,
  verification_authority UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ USER CARBON FOOTPRINT ============

CREATE TABLE IF NOT EXISTS public.user_carbon_footprint (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  total_offset_tons DECIMAL(12,4) DEFAULT 0 CHECK (total_offset_tons >= 0),
  investment_count INTEGER DEFAULT 0 CHECK (investment_count >= 0),
  certificates_earned INTEGER DEFAULT 0 CHECK (certificates_earned >= 0),
  achievement_badges JSONB DEFAULT '[]',
  rank_percentile DECIMAL(5,2),
  impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- ============ GREEN BONDS ============

CREATE TABLE IF NOT EXISTS public.green_bonds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bond_name TEXT NOT NULL,
  issuer_id UUID NOT NULL REFERENCES public.users(id),
  total_value DECIMAL(18,2) NOT NULL CHECK (total_value > 0),
  coupon_rate DECIMAL(5,4) NOT NULL CHECK (coupon_rate >= 0),
  maturity_date DATE NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'matured', 'defaulted', 'cancelled')),
  backed_projects UUID[],
  minimum_investment DECIMAL(12,2) DEFAULT 10000,
  investors_count INTEGER DEFAULT 0 CHECK (investors_count >= 0),
  raised_amount DECIMAL(18,2) DEFAULT 0 CHECK (raised_amount >= 0),
  yield_to_maturity DECIMAL(5,4),
  esg_rating TEXT CHECK (esg_rating IN ('AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.green_bond_holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bond_id UUID NOT NULL REFERENCES public.green_bonds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  units DECIMAL(12,4) NOT NULL CHECK (units > 0),
  purchase_price DECIMAL(12,2) NOT NULL,
  purchase_date DATE DEFAULT CURRENT_DATE,
  current_value DECIMAL(12,2),
  accrued_interest DECIMAL(12,2) DEFAULT 0,
  last_coupon_payment DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ADVISOR EARNINGS ============

CREATE TABLE IF NOT EXISTS public.advisor_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('consultation', 'project_commission', 'success_fee', 'subscription')),
  source_id UUID,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  payment_date TIMESTAMPTZ,
  transaction_hash TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ ENHANCED CARBON IMPACT TRACKING ============

ALTER TABLE public.carbon_impact_tracking ADD COLUMN IF NOT EXISTS
  satellite_verification_url TEXT;

ALTER TABLE public.carbon_impact_tracking ADD COLUMN IF NOT EXISTS
  iot_sensor_data JSONB DEFAULT '{}';

ALTER TABLE public.carbon_impact_tracking ADD COLUMN IF NOT EXISTS
  third_party_audit_report TEXT;

ALTER TABLE public.carbon_impact_tracking ADD COLUMN IF NOT EXISTS
  community_feedback_score DECIMAL(3,2) CHECK (community_feedback_score >= 0 AND community_feedback_score <= 5);

-- ============ ENHANCED VERIFICATION REWARDS ============

ALTER TABLE public.verification_rewards ADD COLUMN IF NOT EXISTS
  impact_bonus DECIMAL(10,2) DEFAULT 0;

ALTER TABLE public.verification_rewards ADD COLUMN IF NOT EXISTS
  community_validation_score DECIMAL(3,2) CHECK (community_validation_score >= 0 AND community_validation_score <= 5);

-- ============ ENHANCED NGO DONATIONS ============

ALTER TABLE public.ngo_donations ADD COLUMN IF NOT EXISTS
  tax_receipt_issued BOOLEAN DEFAULT FALSE;

ALTER TABLE public.ngo_donations ADD COLUMN IF NOT EXISTS
  tax_receipt_url TEXT;

ALTER TABLE public.ngo_donations ADD COLUMN IF NOT EXISTS
  is_recurring BOOLEAN DEFAULT FALSE;

ALTER TABLE public.ngo_donations ADD COLUMN IF NOT EXISTS
  recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'annually', NULL));

-- ============ ENABLE RLS ============

ALTER TABLE public.project_verification_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_carbon_footprint ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_bonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_bond_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_earnings ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============

-- Project verification steps policies
CREATE POLICY "Verifiers can manage assigned project steps" ON public.project_verification_steps
  FOR ALL USING (
    auth.uid() = verifier_id OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Project owners can view verification steps" ON public.project_verification_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND created_by = auth.uid()
    )
  );

-- Carbon certificates policies
CREATE POLICY "Users can view own certificates" ON public.carbon_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Verifiers can issue certificates" ON public.carbon_certificates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('verifier', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can manage all certificates" ON public.carbon_certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- User carbon footprint policies
CREATE POLICY "Users can view own footprint" ON public.user_carbon_footprint
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update footprint" ON public.user_carbon_footprint
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Green bonds policies
CREATE POLICY "Anyone can view active bonds" ON public.green_bonds
  FOR SELECT USING (status = 'active');

CREATE POLICY "Institutional investors can create bonds" ON public.green_bonds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('institutional_investor', 'carbon_provider', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Bond issuers can update own bonds" ON public.green_bonds
  FOR UPDATE USING (auth.uid() = issuer_id);

-- Green bond holdings policies
CREATE POLICY "Users can view own holdings" ON public.green_bond_holdings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create holdings" ON public.green_bond_holdings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Advisor earnings policies
CREATE POLICY "Advisors can view own earnings" ON public.advisor_earnings
  FOR SELECT USING (auth.uid() = advisor_id);

CREATE POLICY "Admins can manage advisor earnings" ON public.advisor_earnings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_verification_steps_project ON public.project_verification_steps(project_id);
CREATE INDEX IF NOT EXISTS idx_verification_steps_verifier ON public.project_verification_steps(verifier_id);
CREATE INDEX IF NOT EXISTS idx_verification_steps_status ON public.project_verification_steps(status);

CREATE INDEX IF NOT EXISTS idx_carbon_certificates_user ON public.carbon_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_certificates_project ON public.carbon_certificates(project_id);
CREATE INDEX IF NOT EXISTS idx_carbon_certificates_retired ON public.carbon_certificates(retired);

CREATE INDEX IF NOT EXISTS idx_user_footprint_user_month ON public.user_carbon_footprint(user_id, month DESC);

CREATE INDEX IF NOT EXISTS idx_green_bonds_status ON public.green_bonds(status);
CREATE INDEX IF NOT EXISTS idx_green_bonds_issuer ON public.green_bonds(issuer_id);
CREATE INDEX IF NOT EXISTS idx_green_bonds_maturity ON public.green_bonds(maturity_date);

CREATE INDEX IF NOT EXISTS idx_bond_holdings_user ON public.green_bond_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_bond_holdings_bond ON public.green_bond_holdings(bond_id);

CREATE INDEX IF NOT EXISTS idx_advisor_earnings_advisor ON public.advisor_earnings(advisor_id);
CREATE INDEX IF NOT EXISTS idx_advisor_earnings_status ON public.advisor_earnings(status);

-- ============ HELPER FUNCTIONS ============

-- Function to calculate user carbon offset total
CREATE OR REPLACE FUNCTION public.calculate_user_carbon_offset(p_user_id UUID)
RETURNS DECIMAL(12,4) AS $$
DECLARE
  v_total_offset DECIMAL(12,4);
BEGIN
  SELECT COALESCE(SUM(i.carbon_credits), 0)
  INTO v_total_offset
  FROM public.investments i
  WHERE i.user_id = p_user_id
    AND i.status IN ('active', 'completed');
  
  RETURN v_total_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user carbon footprint
CREATE OR REPLACE FUNCTION public.update_user_carbon_footprint(p_user_id UUID, p_month DATE)
RETURNS VOID AS $$
DECLARE
  v_offset_tons DECIMAL(12,4);
  v_investment_count INTEGER;
  v_certificate_count INTEGER;
  v_impact_score INTEGER;
BEGIN
  -- Calculate metrics
  SELECT 
    COALESCE(SUM(i.carbon_credits), 0),
    COUNT(*)
  INTO v_offset_tons, v_investment_count
  FROM public.investments i
  WHERE i.user_id = p_user_id
    AND DATE_TRUNC('month', i.date) = DATE_TRUNC('month', p_month)
    AND i.status IN ('active', 'completed');
  
  SELECT COUNT(*)
  INTO v_certificate_count
  FROM public.carbon_certificates
  WHERE user_id = p_user_id
    AND DATE_TRUNC('month', issued_at) = DATE_TRUNC('month', p_month);
  
  -- Calculate impact score (arbitrary formula)
  v_impact_score := (v_offset_tons * 10) + (v_investment_count * 50) + (v_certificate_count * 100);
  
  -- Upsert footprint record
  INSERT INTO public.user_carbon_footprint (
    user_id,
    month,
    total_offset_tons,
    investment_count,
    certificates_earned,
    impact_score
  ) VALUES (
    p_user_id,
    DATE_TRUNC('month', p_month),
    v_offset_tons,
    v_investment_count,
    v_certificate_count,
    v_impact_score
  )
  ON CONFLICT (user_id, month)
  DO UPDATE SET
    total_offset_tons = EXCLUDED.total_offset_tons,
    investment_count = EXCLUDED.investment_count,
    certificates_earned = EXCLUDED.certificates_earned,
    impact_score = EXCLUDED.impact_score,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to issue carbon certificate
CREATE OR REPLACE FUNCTION public.issue_carbon_certificate(
  p_project_id UUID,
  p_user_id UUID,
  p_carbon_tons DECIMAL,
  p_blockchain_hash TEXT,
  p_verifier_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_certificate_id UUID;
  v_certificate_number TEXT;
BEGIN
  -- Generate certificate number
  v_certificate_number := 'DCB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(MD5(RANDOM()::TEXT), 1, 8);
  
  -- Insert certificate
  INSERT INTO public.carbon_certificates (
    certificate_number,
    project_id,
    user_id,
    carbon_tons,
    blockchain_hash,
    valid_until,
    verification_authority
  ) VALUES (
    v_certificate_number,
    p_project_id,
    p_user_id,
    p_carbon_tons,
    p_blockchain_hash,
    NOW() + INTERVAL '10 years',
    p_verifier_id
  )
  RETURNING id INTO v_certificate_id;
  
  -- Update user footprint
  PERFORM public.update_user_carbon_footprint(p_user_id, CURRENT_DATE);
  
  -- Send notification
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    p_user_id,
    'success',
    'Carbon Certificate Issued',
    'You have been issued a carbon offset certificate for ' || p_carbon_tons || ' tons of CO₂.'
  );
  
  RETURN v_certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update verification rewards with impact bonus
CREATE OR REPLACE FUNCTION public.calculate_verification_impact_bonus()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate impact bonus based on project carbon credits
  NEW.impact_bonus := (
    SELECT (p.carbon_credits::DECIMAL / 1000) * 10
    FROM public.projects p
    WHERE p.id = NEW.project_id
  );
  
  -- Recalculate total reward
  NEW.total_reward := NEW.base_reward + NEW.accuracy_bonus + NEW.speed_bonus + COALESCE(NEW.impact_bonus, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_verification_impact
  BEFORE INSERT OR UPDATE ON public.verification_rewards
  FOR EACH ROW EXECUTE FUNCTION public.calculate_verification_impact_bonus();

-- Trigger to update updated_at columns
CREATE TRIGGER update_project_verification_steps_updated_at
  BEFORE UPDATE ON public.project_verification_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_carbon_footprint_updated_at
  BEFORE UPDATE ON public.user_carbon_footprint
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_green_bonds_updated_at
  BEFORE UPDATE ON public.green_bonds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_green_bond_holdings_updated_at
  BEFORE UPDATE ON public.green_bond_holdings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============ MATERIALIZED VIEW FOR PLATFORM IMPACT ============

CREATE MATERIALIZED VIEW IF NOT EXISTS public.platform_impact_summary AS
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT p.id) as total_projects,
  SUM(p.carbon_credits) as total_carbon_credits,
  COUNT(DISTINCT cc.id) as total_certificates,
  SUM(cc.carbon_tons) as total_offset_tons,
  SUM(i.amount) as total_investments,
  COUNT(DISTINCT i.user_id) as active_investors
FROM public.users u
LEFT JOIN public.projects p ON p.status IN ('active', 'completed')
LEFT JOIN public.carbon_certificates cc ON cc.retired = FALSE
LEFT JOIN public.investments i ON i.status IN ('active', 'completed');

CREATE UNIQUE INDEX ON public.platform_impact_summary ((1));

-- Function to refresh impact summary
CREATE OR REPLACE FUNCTION public.refresh_platform_impact_summary()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.platform_impact_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;