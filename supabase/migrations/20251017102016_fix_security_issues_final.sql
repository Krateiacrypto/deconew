/*
  # Comprehensive Security Fixes

  1. Performance Improvements
    - Add indexes on all foreign key columns
    - Optimize RLS policies to use (SELECT auth.uid()) pattern
  
  2. Function Security
    - Fix search_path mutability for all functions
    - Properly drop and recreate functions with SECURITY DEFINER
    - Add explicit schema references
  
  3. RLS Policy Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in WHERE clauses
    - Improve policy performance with proper indexing
  
  ## Notes
  - All changes are backward compatible
  - Indexes improve query performance significantly
  - RLS policies optimized to prevent re-evaluation
*/

-- ============================================================================
-- PART 1: Add Missing Indexes on Foreign Keys
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_advisor_recommendations_client_id 
  ON public.advisor_recommendations(client_id);

CREATE INDEX IF NOT EXISTS idx_advisor_recommendations_advisor_id 
  ON public.advisor_recommendations(advisor_id);

CREATE INDEX IF NOT EXISTS idx_advisor_recommendations_project_id 
  ON public.advisor_recommendations(project_id);

CREATE INDEX IF NOT EXISTS idx_ngo_donations_donor_id 
  ON public.ngo_donations(donor_id);

CREATE INDEX IF NOT EXISTS idx_ngo_donations_project_id 
  ON public.ngo_donations(project_id);

CREATE INDEX IF NOT EXISTS idx_ngo_donations_ngo_id 
  ON public.ngo_donations(ngo_id);

CREATE INDEX IF NOT EXISTS idx_ngo_sponsorships_sponsor_id 
  ON public.ngo_sponsorships(sponsor_id);

CREATE INDEX IF NOT EXISTS idx_ngo_sponsorships_project_id 
  ON public.ngo_sponsorships(project_id);

CREATE INDEX IF NOT EXISTS idx_ngo_sponsorships_ngo_id 
  ON public.ngo_sponsorships(ngo_id);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id 
  ON public.project_milestones(project_id);

CREATE INDEX IF NOT EXISTS idx_project_milestones_verified_by 
  ON public.project_milestones(verified_by);

CREATE INDEX IF NOT EXISTS idx_user_custom_permissions_user_id 
  ON public.user_custom_permissions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_custom_permissions_granted_by 
  ON public.user_custom_permissions(granted_by);

CREATE INDEX IF NOT EXISTS idx_verification_rewards_verifier_id 
  ON public.verification_rewards(verifier_id);

CREATE INDEX IF NOT EXISTS idx_verification_rewards_project_id 
  ON public.verification_rewards(project_id);

-- ============================================================================
-- PART 2: Drop Existing Functions (to be recreated with proper security)
-- ============================================================================

DROP FUNCTION IF EXISTS public.check_and_upgrade_investor_tier(UUID);
DROP FUNCTION IF EXISTS public.calculate_verification_reward(NUMERIC, NUMERIC, NUMERIC);
DROP FUNCTION IF EXISTS public.get_user_permissions(UUID);
DROP FUNCTION IF EXISTS public.has_permission(UUID, TEXT);

-- ============================================================================
-- PART 3: Recreate Functions with Proper Security Settings
-- ============================================================================

-- Function: check_and_upgrade_investor_tier
CREATE OR REPLACE FUNCTION public.check_and_upgrade_investor_tier(p_user_id UUID)
RETURNS TABLE(upgraded BOOLEAN, new_tier TEXT, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_tier TEXT;
  v_total_invested NUMERIC;
  v_staked_amount NUMERIC;
  v_new_tier TEXT;
  v_upgraded BOOLEAN := FALSE;
BEGIN
  SELECT investor_tier INTO v_current_tier
  FROM public.users
  WHERE id = p_user_id;

  IF v_current_tier = 'institutional' THEN
    RETURN QUERY SELECT FALSE, v_current_tier, 'Already at highest tier'::TEXT;
    RETURN;
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_total_invested
  FROM public.investments
  WHERE user_id = p_user_id AND status = 'active';

  SELECT COALESCE(SUM(amount), 0) INTO v_staked_amount
  FROM public.staking_positions
  WHERE user_id = p_user_id AND status = 'active';

  IF v_current_tier = 'free' AND (v_total_invested >= 1000 OR v_staked_amount >= 10000) THEN
    v_new_tier := 'pro';
    v_upgraded := TRUE;
  ELSIF v_current_tier = 'pro' AND v_total_invested >= 10000 THEN
    v_new_tier := 'institutional';
    v_upgraded := TRUE;
  END IF;

  IF v_upgraded THEN
    UPDATE public.users
    SET 
      investor_tier = v_new_tier,
      tier_upgraded_at = NOW()
    WHERE id = p_user_id;

    RETURN QUERY SELECT TRUE, v_new_tier, format('Upgraded to %s tier', v_new_tier);
  ELSE
    RETURN QUERY SELECT FALSE, v_current_tier, 'Not eligible for upgrade'::TEXT;
  END IF;
END;
$$;

-- Function: calculate_verification_reward
CREATE OR REPLACE FUNCTION public.calculate_verification_reward(
  p_base_reward NUMERIC DEFAULT 100,
  p_accuracy_score NUMERIC DEFAULT 1.0,
  p_completion_hours NUMERIC DEFAULT 72
)
RETURNS TABLE(
  base_reward NUMERIC,
  accuracy_bonus NUMERIC,
  speed_bonus NUMERIC,
  total_reward NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_accuracy_bonus NUMERIC := 0;
  v_speed_bonus NUMERIC := 0;
BEGIN
  IF p_accuracy_score >= 0.95 THEN
    v_accuracy_bonus := p_base_reward * 0.5;
  END IF;

  IF p_completion_hours < 72 THEN
    v_speed_bonus := p_base_reward * 0.25;
  END IF;

  RETURN QUERY SELECT 
    p_base_reward,
    v_accuracy_bonus,
    v_speed_bonus,
    p_base_reward + v_accuracy_bonus + v_speed_bonus;
END;
$$;

-- Function: get_user_permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE(permission_code TEXT, source TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  SELECT role INTO v_user_role
  FROM public.users
  WHERE id = p_user_id;

  RETURN QUERY
  SELECT rp.permission_code, 'role'::TEXT as source
  FROM public.role_permissions rp
  WHERE rp.role = v_user_role;

  RETURN QUERY
  SELECT ucp.permission_code, 'custom'::TEXT as source
  FROM public.user_custom_permissions ucp
  WHERE ucp.user_id = p_user_id 
    AND ucp.granted = TRUE
    AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW());
END;
$$;

-- Function: has_permission
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_permission_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.get_user_permissions(p_user_id)
    WHERE permission_code = p_permission_code
  ) INTO v_has_permission;

  RETURN v_has_permission;
END;
$$;

-- ============================================================================
-- PART 4: Optimize RLS Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own recommendations" ON public.advisor_recommendations;
CREATE POLICY "Users can view own recommendations"
  ON public.advisor_recommendations FOR SELECT
  TO authenticated
  USING (client_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Advisors can view assigned recommendations" ON public.advisor_recommendations;
CREATE POLICY "Advisors can view assigned recommendations"
  ON public.advisor_recommendations FOR SELECT
  TO authenticated
  USING (advisor_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own donations" ON public.ngo_donations;
CREATE POLICY "Users can view own donations"
  ON public.ngo_donations FOR SELECT
  TO authenticated
  USING (donor_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create donations" ON public.ngo_donations;
CREATE POLICY "Users can create donations"
  ON public.ngo_donations FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Sponsors can view own sponsorships" ON public.ngo_sponsorships;
CREATE POLICY "Sponsors can view own sponsorships"
  ON public.ngo_sponsorships FOR SELECT
  TO authenticated
  USING (sponsor_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own custom permissions" ON public.user_custom_permissions;
CREATE POLICY "Users can view own custom permissions"
  ON public.user_custom_permissions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Verifiers can view own rewards" ON public.verification_rewards;
CREATE POLICY "Verifiers can view own rewards"
  ON public.verification_rewards FOR SELECT
  TO authenticated
  USING (verifier_id = (SELECT auth.uid()));

-- ============================================================================
-- Grant Execute Permissions on Functions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.check_and_upgrade_investor_tier(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_verification_reward(NUMERIC, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO authenticated;