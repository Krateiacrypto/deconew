import { supabase } from '../lib/supabase';
import { InvestorTier } from '../types';

export interface TierUpgradeResult {
  upgraded: boolean;
  current_tier: InvestorTier;
  total_invested: number;
  total_staked?: number;
}

export interface TierLimits {
  role: string;
  tier: InvestorTier;
  minimumInvestment: number;
  monthlyLimit?: number;
  tradingFee: number;
  stakingMultiplier: number;
}

export const tierService = {
  async checkAndUpgradeTier(userId: string): Promise<TierUpgradeResult> {
    const { data, error } = await supabase.rpc('check_and_upgrade_investor_tier', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error checking tier upgrade:', error);
      throw error;
    }

    return data;
  },

  async getUserTierLimits(userId: string): Promise<TierLimits> {
    const { data, error } = await supabase.rpc('get_investor_limits', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching tier limits:', error);
      throw error;
    }

    return data;
  },

  async getUserInvestmentStats(userId: string): Promise<{
    totalInvested: number;
    totalStaked: number;
    investmentCount: number;
    monthlyInvested: number;
  }> {
    // Get total investments
    const { data: investments, error: invError } = await supabase
      .from('investments')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['active', 'completed']);

    if (invError) {
      console.error('Error fetching investments:', invError);
      throw invError;
    }

    const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
    const investmentCount = investments?.length || 0;

    // Get monthly investments
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthlyInv, error: monthError } = await supabase
      .from('investments')
      .select('amount')
      .eq('user_id', userId)
      .in('status', ['active', 'completed'])
      .gte('date', startOfMonth.toISOString());

    if (monthError) {
      console.error('Error fetching monthly investments:', monthError);
      throw monthError;
    }

    const monthlyInvested = monthlyInv?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

    // Get staking positions
    const { data: staking, error: stakingError } = await supabase
      .from('staking_positions')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (stakingError) {
      console.error('Error fetching staking:', stakingError);
      throw stakingError;
    }

    const totalStaked = staking?.reduce((sum, stake) => sum + Number(stake.amount), 0) || 0;

    return {
      totalInvested,
      totalStaked,
      investmentCount,
      monthlyInvested
    };
  },

  async canUpgradeToTier(userId: string, targetTier: InvestorTier): Promise<{
    canUpgrade: boolean;
    reason: string;
    requirements: {
      minimumInvestment: number;
      currentInvestment: number;
      alternativeStaking?: number;
    };
  }> {
    const stats = await this.getUserInvestmentStats(userId);
    const { data: user } = await supabase
      .from('users')
      .select('investor_tier')
      .eq('id', userId)
      .single();

    const requirements = {
      free: { minimumInvestment: 100, stakingAlternative: 0 },
      pro: { minimumInvestment: 1000, stakingAlternative: 10000 },
      institutional: { minimumInvestment: 10000, stakingAlternative: 0 }
    };

    const targetReq = requirements[targetTier];
    const meetsInvestment = stats.totalInvested >= targetReq.minimumInvestment;
    const meetsStaking = targetReq.stakingAlternative > 0 &&
                         stats.totalStaked >= targetReq.stakingAlternative;

    const canUpgrade = meetsInvestment || meetsStaking;

    let reason = '';
    if (canUpgrade) {
      reason = `You meet the requirements for ${targetTier} tier`;
    } else {
      const needed = targetReq.minimumInvestment - stats.totalInvested;
      reason = `You need $${needed.toFixed(2)} more in investments to upgrade to ${targetTier} tier`;
      if (targetReq.stakingAlternative > 0) {
        const neededStaking = targetReq.stakingAlternative - stats.totalStaked;
        reason += ` or ${neededStaking.toFixed(0)} more ICO2 staked`;
      }
    }

    return {
      canUpgrade,
      reason,
      requirements: {
        minimumInvestment: targetReq.minimumInvestment,
        currentInvestment: stats.totalInvested,
        alternativeStaking: targetReq.stakingAlternative || undefined
      }
    };
  },

  getTierBenefits(tier: InvestorTier): string[] {
    const benefits = {
      free: [
        'Basic trading features',
        'Access to educational content',
        'Community forum access',
        'Basic analytics',
        'Up to $10,000 monthly trading limit'
      ],
      pro: [
        'All Free tier benefits',
        'Advanced trading tools',
        'Advanced charts & indicators',
        'Portfolio analytics',
        '1.25x staking rewards',
        '24h priority support',
        'Premium educational content',
        'No monthly trading limits'
      ],
      institutional: [
        'All Pro tier benefits',
        'Bulk trading interface',
        'OTC trading access',
        'Full API access (REST + WebSocket)',
        'Dedicated account manager',
        'Custom reporting',
        'Priority access to new projects',
        'Negotiable investment terms',
        'ESG compliance tracking'
      ]
    };

    return benefits[tier] || [];
  },

  getTierComparison() {
    return [
      {
        feature: 'Minimum Investment',
        free: '$100',
        pro: '$1,000',
        institutional: '$10,000'
      },
      {
        feature: 'Trading Fee',
        free: '0.25%',
        pro: '0.20%',
        institutional: '0.10%'
      },
      {
        feature: 'Withdrawal Fee',
        free: '$5',
        pro: 'Free',
        institutional: 'Free'
      },
      {
        feature: 'Staking Multiplier',
        free: '1.0x',
        pro: '1.25x',
        institutional: '1.0x + custom terms'
      },
      {
        feature: 'Monthly Limit',
        free: '$10,000',
        pro: 'Unlimited',
        institutional: 'Unlimited'
      },
      {
        feature: 'Support Response',
        free: '48-72h',
        pro: '24h',
        institutional: 'Dedicated manager'
      },
      {
        feature: 'API Access',
        free: 'No',
        pro: 'Basic',
        institutional: 'Full (REST + WebSocket)'
      },
      {
        feature: 'Advanced Tools',
        free: 'No',
        pro: 'Yes',
        institutional: 'Yes + Custom'
      }
    ];
  }
};
