/*
  # Complete Permission Management Functions
*/

-- Clean up
DROP FUNCTION IF EXISTS public.check_and_upgrade_investor_tier(UUID);
DROP TRIGGER IF EXISTS auto_check_investor_tier ON public.investments;
DROP FUNCTION IF EXISTS public.check_tier_after_investment();

-- ============ GET USER EFFECTIVE PERMISSIONS ============

CREATE OR REPLACE FUNCTION public.get_user_effective_permissions(p_user_id UUID)
RETURNS TABLE (
  permission_code TEXT,
  permission_name TEXT,
  permission_category TEXT,
  source TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_role AS (
    SELECT role FROM public.users WHERE id = p_user_id
  ),
  role_perms AS (
    SELECT 
      rp.permission_code,
      p.name as permission_name,
      p.category as permission_category,
      'role' as source
    FROM public.role_permissions rp
    JOIN public.permissions p ON p.code = rp.permission_code
    WHERE rp.role = (SELECT role FROM user_role)
  )
  SELECT * FROM role_perms;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============ AUTO-UPGRADE INVESTOR TIER ============

CREATE OR REPLACE FUNCTION public.check_and_upgrade_investor_tier(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user RECORD;
  v_total_invested DECIMAL(12,2);
  v_new_tier TEXT;
  v_upgraded BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_user FROM public.users WHERE id = p_user_id;
  
  SELECT COALESCE(SUM(amount), 0) INTO v_total_invested
  FROM public.investments
  WHERE user_id = p_user_id AND status IN ('active', 'completed');
  
  IF v_user.investor_tier = 'free' AND v_total_invested >= 1000 THEN
    v_new_tier := 'pro';
    v_upgraded := TRUE;
  ELSIF v_user.investor_tier = 'pro' AND v_total_invested >= 10000 THEN
    v_new_tier := 'institutional';
    v_upgraded := TRUE;
  END IF;
  
  IF v_upgraded THEN
    UPDATE public.users
    SET investor_tier = v_new_tier,
        role = v_new_tier || '_investor',
        tier_upgraded_at = NOW()
    WHERE id = p_user_id;
  END IF;
  
  RETURN json_build_object(
    'upgraded', v_upgraded,
    'current_tier', COALESCE(v_new_tier, v_user.investor_tier),
    'total_invested', v_total_invested
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============ TRIGGER FUNCTION ============

CREATE OR REPLACE FUNCTION public.check_tier_after_investment()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.check_and_upgrade_investor_tier(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_check_investor_tier
  AFTER INSERT OR UPDATE OF status ON public.investments
  FOR EACH ROW 
  WHEN (NEW.status IN ('active', 'completed'))
  EXECUTE FUNCTION public.check_tier_after_investment();