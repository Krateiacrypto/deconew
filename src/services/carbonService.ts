import { supabase } from '../lib/supabase';

export interface CarbonCertificate {
  id: string;
  certificate_number: string;
  project_id: string;
  user_id: string;
  carbon_tons: number;
  blockchain_hash: string;
  ipfs_hash?: string;
  issued_at: string;
  valid_until: string;
  retired: boolean;
  retired_at?: string;
  project?: {
    title: string;
    category: string;
  };
}

export interface CarbonFootprint {
  id: string;
  user_id: string;
  month: string;
  total_offset_tons: number;
  investment_count: number;
  certificates_earned: number;
  achievement_badges: any[];
  rank_percentile?: number;
  impact_score: number;
}

export interface CarbonImpactData {
  totalOffset: number;
  monthlyOffset: number;
  certificates: number;
  impactScore: number;
  rank: number;
  badges: any[];
  trend: number;
}

export const carbonService = {
  async getUserCarbonCertificates(userId: string): Promise<CarbonCertificate[]> {
    const { data, error } = await supabase
      .from('carbon_certificates')
      .select(`
        *,
        project:projects(title, category)
      `)
      .eq('user_id', userId)
      .eq('retired', false)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }

    return data || [];
  },

  async getUserCarbonFootprint(userId: string, months: number = 12): Promise<CarbonFootprint[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from('user_carbon_footprint')
      .select('*')
      .eq('user_id', userId)
      .gte('month', startDate.toISOString().split('T')[0])
      .order('month', { ascending: false });

    if (error) {
      console.error('Error fetching carbon footprint:', error);
      throw error;
    }

    return data || [];
  },

  async getCurrentCarbonImpact(userId: string): Promise<CarbonImpactData> {
    // Get total offset from function
    const { data: totalOffset, error: offsetError } = await supabase
      .rpc('calculate_user_carbon_offset', { p_user_id: userId });

    if (offsetError) {
      console.error('Error calculating offset:', offsetError);
      throw offsetError;
    }

    // Get current month footprint
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
    const { data: footprint, error: footprintError } = await supabase
      .from('user_carbon_footprint')
      .select('*')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .maybeSingle();

    if (footprintError && footprintError.code !== 'PGRST116') {
      console.error('Error fetching footprint:', footprintError);
    }

    // Get certificates count
    const { count: certCount, error: certError } = await supabase
      .from('carbon_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('retired', false);

    if (certError) {
      console.error('Error counting certificates:', certError);
    }

    // Get previous month for trend
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStr = prevMonth.toISOString().slice(0, 7) + '-01';

    const { data: prevFootprint } = await supabase
      .from('user_carbon_footprint')
      .select('total_offset_tons')
      .eq('user_id', userId)
      .eq('month', prevMonthStr)
      .maybeSingle();

    const trend = footprint && prevFootprint
      ? ((footprint.total_offset_tons - prevFootprint.total_offset_tons) /
         (prevFootprint.total_offset_tons || 1)) * 100
      : 0;

    return {
      totalOffset: totalOffset || 0,
      monthlyOffset: footprint?.total_offset_tons || 0,
      certificates: certCount || 0,
      impactScore: footprint?.impact_score || 0,
      rank: footprint?.rank_percentile || 0,
      badges: footprint?.achievement_badges || [],
      trend
    };
  },

  async updateUserCarbonFootprint(userId: string): Promise<void> {
    const { error } = await supabase.rpc('update_user_carbon_footprint', {
      p_user_id: userId,
      p_month: new Date().toISOString()
    });

    if (error) {
      console.error('Error updating carbon footprint:', error);
      throw error;
    }
  },

  async issueCertificate(
    projectId: string,
    userId: string,
    carbonTons: number,
    blockchainHash: string,
    verifierId: string
  ): Promise<string> {
    const { data, error } = await supabase.rpc('issue_carbon_certificate', {
      p_project_id: projectId,
      p_user_id: userId,
      p_carbon_tons: carbonTons,
      p_blockchain_hash: blockchainHash,
      p_verifier_id: verifierId
    });

    if (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }

    return data;
  },

  async retireCertificate(
    certificateId: string,
    reason: string
  ): Promise<void> {
    const { error } = await supabase
      .from('carbon_certificates')
      .update({
        retired: true,
        retired_at: new Date().toISOString(),
        retirement_reason: reason
      })
      .eq('id', certificateId);

    if (error) {
      console.error('Error retiring certificate:', error);
      throw error;
    }
  },

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

    const { data, error } = await supabase
      .from('user_carbon_footprint')
      .select(`
        *,
        user:users(name, avatar)
      `)
      .eq('month', currentMonth)
      .order('impact_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }

    return data || [];
  },

  async getPlatformImpactSummary(): Promise<any> {
    const { data, error } = await supabase
      .from('platform_impact_summary')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching platform impact:', error);
      throw error;
    }

    return data || {
      total_users: 0,
      total_projects: 0,
      total_carbon_credits: 0,
      total_certificates: 0,
      total_offset_tons: 0,
      total_investments: 0,
      active_investors: 0
    };
  },

  async refreshPlatformImpact(): Promise<void> {
    const { error } = await supabase.rpc('refresh_platform_impact_summary');

    if (error) {
      console.error('Error refreshing platform impact:', error);
      throw error;
    }
  },

  getImpactEquivalents(carbonTons: number) {
    return {
      trees: Math.round(carbonTons * 50),
      cars: Math.round(carbonTons / 4.6),
      homes: Math.round(carbonTons / 7.5),
      flights: Math.round(carbonTons / 0.9)
    };
  },

  getCarbonOffsetRecommendations(userId: string, annualFootprint: number) {
    // Average person emits 4-16 tons CO2/year depending on country
    const monthlyTarget = annualFootprint / 12;

    return {
      monthlyTarget,
      suggestedInvestment: monthlyTarget * 15, // Assuming $15/ton average
      projectCategories: [
        { category: 'renewable', allocation: 0.4, reason: 'Highest long-term impact' },
        { category: 'forest', allocation: 0.3, reason: 'Natural carbon capture' },
        { category: 'technology', allocation: 0.2, reason: 'Innovation in carbon capture' },
        { category: 'agriculture', allocation: 0.1, reason: 'Sustainable practices' }
      ]
    };
  }
};
