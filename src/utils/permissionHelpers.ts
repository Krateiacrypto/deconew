import { UserRole, InvestorTier, KYCLevel } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  superadmin: ['*'], // Full access

  admin: [
    'users.view',
    'users.edit',
    'users.kyc.approve',
    'projects.approve',
    'projects.delist',
    'content.blog.publish',
    'analytics.view',
    'analytics.advanced',
  ],

  web_admin: [
    'content.blog.create',
    'content.blog.publish',
    'content.pages.edit',
    'content.media.manage',
    'analytics.view',
    'users.view',
  ],

  carbon_provider: [
    'projects.create',
    'projects.edit',
    'analytics.view',
    'staking.basic',
  ],

  verifier: [
    'projects.verify',
    'analytics.view',
  ],

  advisor: [
    'analytics.view',
    'content.blog.create',
  ],

  ngo: [
    'projects.create',
    'projects.edit',
    'analytics.view',
  ],

  institutional_investor: [
    'trading.bulk',
    'trading.otc',
    'trading.advanced',
    'analytics.advanced',
    'analytics.export',
    'staking.enhanced',
    'staking.liquidity',
  ],

  pro_investor: [
    'trading.advanced',
    'analytics.view',
    'staking.enhanced',
  ],

  free_investor: [
    'trading.basic',
    'staking.basic',
  ],

  user: [
    'trading.basic',
    'staking.basic',
  ],
};

export const INVESTOR_TIER_CONFIG: Record<InvestorTier, {
  minimumInvestment: number;
  monthlyLimit?: number;
  tradingFee: number;
  withdrawalFee: number;
  stakingMultiplier: number;
  benefits: string[];
}> = {
  free: {
    minimumInvestment: 100,
    monthlyLimit: 10000,
    tradingFee: 0.0025, // 0.25%
    withdrawalFee: 5,
    stakingMultiplier: 1.0,
    benefits: [
      'Basic trading features',
      'Access to educational content',
      'Community forum access',
      'Basic analytics',
    ],
  },
  pro: {
    minimumInvestment: 1000,
    tradingFee: 0.002, // 0.20%
    withdrawalFee: 0,
    stakingMultiplier: 1.25,
    benefits: [
      'Advanced trading tools',
      'Advanced charts & indicators',
      'Portfolio analytics',
      'Enhanced staking rewards (1.25x)',
      'Priority support (24h response)',
      'Premium educational content',
    ],
  },
  institutional: {
    minimumInvestment: 10000,
    tradingFee: 0.001, // 0.10%
    withdrawalFee: 0,
    stakingMultiplier: 1.0,
    benefits: [
      'Bulk trading interface',
      'OTC access',
      'Full API access (REST + WebSocket)',
      'Dedicated account manager',
      'Custom reporting',
      'Priority access to new projects',
      'Negotiable investment terms',
      'ESG compliance tracking',
    ],
  },
};

export const KYC_LEVEL_REQUIREMENTS: Record<KYCLevel, {
  name: string;
  requirements: string[];
  benefits: string[];
  investmentLimit?: number;
}> = {
  level_1: {
    name: 'Basic KYC',
    requirements: [
      'Email verification',
      'Phone verification',
      'Basic personal information',
    ],
    benefits: [
      'Access to platform',
      'Browse projects',
      'View market data',
    ],
    investmentLimit: 1000,
  },
  level_2: {
    name: 'Enhanced KYC',
    requirements: [
      'Government-issued ID',
      'Proof of address',
      'Selfie verification',
      'Personal information verification',
    ],
    benefits: [
      'All Level 1 benefits',
      'Invest up to $10,000',
      'Full trading access',
      'Staking participation',
      'Withdrawal permissions',
    ],
    investmentLimit: 10000,
  },
  level_3: {
    name: 'Institutional KYC',
    requirements: [
      'Company registration documents',
      'Tax ID / EIN',
      'Beneficial owners disclosure',
      'Business verification',
      'Enhanced due diligence',
    ],
    benefits: [
      'All Level 2 benefits',
      'Unlimited investment',
      'Institutional features',
      'API access',
      'Bulk trading',
      'Custom terms negotiation',
    ],
  },
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];

  if (!rolePermissions) return false;

  if (rolePermissions.includes('*')) return true;

  return rolePermissions.includes(permission);
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, string[]> = {
    '/admin': ['admin', 'superadmin'],
    '/admin/users': ['admin', 'superadmin'],
    '/admin/kyc': ['admin', 'superadmin', 'verifier'],
    '/admin/projects': ['admin', 'superadmin'],
    '/admin/content': ['admin', 'superadmin', 'web_admin'],
    '/admin/system': ['superadmin'],
    '/dashboard/provider': ['carbon_provider'],
    '/dashboard/verifier': ['verifier'],
    '/dashboard/advisor': ['advisor'],
    '/trading': ['institutional_investor', 'pro_investor', 'free_investor', 'user'],
    '/staking': ['institutional_investor', 'pro_investor', 'free_investor', 'user'],
  };

  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true; // Public route

  return allowedRoles.includes(userRole);
}

export function getInvestorTierLimits(tier: InvestorTier) {
  return INVESTOR_TIER_CONFIG[tier];
}

export function getKYCLevelInfo(level: KYCLevel) {
  return KYC_LEVEL_REQUIREMENTS[level];
}

export function canUpgradeTier(
  currentTier: InvestorTier,
  totalInvested: number,
  stakedAmount: number
): { canUpgrade: boolean; targetTier?: InvestorTier; reason?: string } {
  if (currentTier === 'institutional') {
    return { canUpgrade: false, reason: 'Already at highest tier' };
  }

  if (currentTier === 'free') {
    const proConfig = INVESTOR_TIER_CONFIG.pro;
    if (totalInvested >= proConfig.minimumInvestment || stakedAmount >= 10000) {
      return {
        canUpgrade: true,
        targetTier: 'pro',
        reason: `Eligible for Pro tier (invested: $${totalInvested}, staked: ${stakedAmount} ICO2)`,
      };
    }
  }

  if (currentTier === 'pro') {
    const instConfig = INVESTOR_TIER_CONFIG.institutional;
    if (totalInvested >= instConfig.minimumInvestment) {
      return {
        canUpgrade: true,
        targetTier: 'institutional',
        reason: `Eligible for Institutional tier (invested: $${totalInvested})`,
      };
    }
  }

  return { canUpgrade: false, reason: 'Investment threshold not met' };
}

export function getVerificationReward(
  baseReward: number = 100,
  accuracyScore: number,
  completionTime: number, // in hours
  targetTime: number = 72 // 3 days
): {
  baseReward: number;
  accuracyBonus: number;
  speedBonus: number;
  totalReward: number;
} {
  // Accuracy bonus: up to 50% extra for high accuracy
  const accuracyBonus = accuracyScore >= 0.95 ? baseReward * 0.5 : 0;

  // Speed bonus: 25% for fast-track completion (under target time)
  const speedBonus = completionTime < targetTime ? baseReward * 0.25 : 0;

  return {
    baseReward,
    accuracyBonus,
    speedBonus,
    totalReward: baseReward + accuracyBonus + speedBonus,
  };
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  superadmin: 'Super Administrator',
  admin: 'Platform Administrator',
  web_admin: 'Web Administrator',
  carbon_provider: 'Carbon Provider',
  verifier: 'Verification Authority',
  advisor: 'Investment Advisor',
  ngo: 'NGO / Non-Profit',
  institutional_investor: 'Institutional Investor',
  pro_investor: 'Pro Investor',
  free_investor: 'Free Investor',
  user: 'User',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  web_admin: 'bg-cyan-100 text-cyan-800',
  carbon_provider: 'bg-emerald-100 text-emerald-800',
  verifier: 'bg-green-100 text-green-800',
  advisor: 'bg-yellow-100 text-yellow-800',
  ngo: 'bg-pink-100 text-pink-800',
  institutional_investor: 'bg-indigo-100 text-indigo-800',
  pro_investor: 'bg-violet-100 text-violet-800',
  free_investor: 'bg-gray-100 text-gray-800',
  user: 'bg-gray-100 text-gray-800',
};
