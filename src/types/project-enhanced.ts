/**
 * Enhanced Project Types for Investor-Focused Experience
 * Extends base Project interface with detailed investment and verification data
 */

import { Project } from './index';

// ============================================
// EXTENDED PROJECT TYPES
// ============================================

export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  linkedin?: string;
  credentials?: string[];
}

export interface ProjectPartner {
  id: string;
  name: string;
  logo: string;
  type: 'implementation' | 'verification' | 'financial' | 'technology';
  website?: string;
  description?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  verificationStatus?: 'verified' | 'unverified';
  progress: number;
  evidence?: string[]; // Photos, documents
}

export interface ProjectLocation {
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  area: number; // hectares or square meters
  mapUrl?: string;
}

export interface CarbonImpact {
  totalCO2Reduction: number; // tons per year
  equivalentTrees: number;
  equivalentCars: number; // cars off road
  biodiversityScore: number; // 0-100
  waterSaved?: number; // liters
  energyGenerated?: number; // MWh (for renewable projects)
}

export interface TokenEconomics {
  tokenSymbol: string;
  totalSupply: number;
  circulatingSupply: number;
  initialPrice: number;
  currentPrice: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  marketCap: number;
  tradingVolume24h: number;
}

export interface RevenueModel {
  sources: Array<{
    name: string;
    percentage: number;
    description: string;
  }>;
  projectedRevenue: Array<{
    year: number;
    amount: number;
  }>;
  paymentSchedule: 'monthly' | 'quarterly' | 'annually';
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  factors: Array<{
    category: 'market' | 'regulatory' | 'operational' | 'environmental' | 'financial';
    level: 'low' | 'medium' | 'high';
    description: string;
    mitigation?: string;
  }>;
  auditScore: number; // 0-100
  insuranceCoverage?: {
    provider: string;
    amount: number;
    coverage: string[];
  };
}

export interface Verification {
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    documentUrl: string;
    verified: boolean;
  }>;
  auditReports: Array<{
    auditor: string;
    date: string;
    score: number;
    summary: string;
    reportUrl: string;
  }>;
  blockchainTransactions: Array<{
    hash: string;
    type: 'funding' | 'carbon_credit' | 'milestone' | 'payment';
    date: string;
    amount?: number;
    verified: boolean;
  }>;
  thirdPartyReviews: Array<{
    reviewer: string;
    rating: number;
    date: string;
    summary: string;
    fullReviewUrl?: string;
  }>;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'progress' | 'milestone' | 'financial' | 'regulatory' | 'general';
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }>;
  likes: number;
  comments: number;
}

export interface InvestorReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  investmentAmount: number;
  verified: boolean; // verified investor
  helpful: number; // helpful votes
}

export interface SocialProof {
  totalInvestors: number;
  recentInvestments: Array<{
    amount: number;
    date: string;
    anonymous: boolean;
  }>;
  averageRating: number;
  totalReviews: number;
  mediaCoverage: Array<{
    outlet: string;
    title: string;
    date: string;
    url: string;
    logo?: string;
  }>;
}

export interface HistoricalReturns {
  roi: Array<{
    period: '1M' | '3M' | '6M' | '1Y' | 'All';
    percentage: number;
  }>;
  distributions: Array<{
    date: string;
    amountPerToken: number;
    totalAmount: number;
  }>;
  benchmarkComparison: {
    project: number;
    sectorAverage: number;
    marketIndex: number;
  };
}

// ============================================
// ENHANCED PROJECT INTERFACE
// ============================================

export interface EnhancedProject extends Project {
  // Team & Partners
  team: ProjectTeamMember[];
  partners: ProjectPartner[];

  // Timeline & Milestones
  milestones: ProjectMilestone[];

  // Location Details
  locationDetails: ProjectLocation;

  // Impact Metrics
  carbonImpact: CarbonImpact;
  impactBeforeAfter?: {
    before: string[]; // image URLs
    after: string[]; // image URLs
  };

  // Financial Details
  tokenEconomics: TokenEconomics;
  revenueModel: RevenueModel;
  historicalReturns: HistoricalReturns;

  // Risk & Verification
  riskAssessment: RiskAssessment;
  verification: Verification;

  // Social Proof
  socialProof: SocialProof;
  investorReviews: InvestorReview[];

  // Updates & Progress
  updates: ProjectUpdate[];
  lastUpdate?: string;

  // Investment Stats
  averageInvestment: number;
  investmentRange: {
    min: number;
    max: number;
  };
  daysRemaining: number;
  fundingVelocity: number; // $ per day

  // Badges
  badges: Array<'verified' | 'trending' | 'high_impact' | 'low_risk' | 'quick_returns' | 'featured'>;
}

// ============================================
// FILTER & SORT TYPES
// ============================================

export type ProjectSortOption =
  | 'highest_roi'
  | 'most_funded'
  | 'newest'
  | 'ending_soon'
  | 'highest_impact'
  | 'community_rating'
  | 'lowest_risk';

export interface ProjectFilters {
  categories?: Array<'forest' | 'renewable' | 'water' | 'agriculture' | 'technology'>;
  riskLevel?: Array<'low' | 'medium' | 'high'>;
  minInvestment?: number;
  maxInvestment?: number;
  expectedReturn?: {
    min: number;
    max: number;
  };
  carbonImpact?: {
    min: number;
    max: number;
  };
  location?: string[];
  verified?: boolean;
  badges?: Array<'verified' | 'trending' | 'high_impact' | 'low_risk' | 'quick_returns'>;
}

// ============================================
// INVESTMENT CALCULATOR TYPES
// ============================================

export interface InvestmentCalculation {
  investmentAmount: number;
  tokensReceived: number;
  estimatedReturns: {
    monthly: number;
    yearly: number;
    total: number;
  };
  carbonCredits: number;
  carbonImpact: {
    co2Reduced: number;
    treesEquivalent: number;
    carsOffRoad: number;
  };
  fees: {
    platform: number;
    transaction: number;
    total: number;
  };
  netInvestment: number;
  breakEvenDate: string;
  maturityDate: string;
}

// ============================================
// COMPARISON TYPES
// ============================================

export interface ProjectComparison {
  projects: EnhancedProject[];
  metrics: {
    roi: number[];
    risk: string[];
    carbonImpact: number[];
    minimumInvestment: number[];
    fundingProgress: number[];
    communityRating: number[];
  };
}

// ============================================
// LIVE COUNTER TYPES
// ============================================

export interface LiveCounters {
  co2Reduced: number; // Real-time accumulating
  activeInvestors: number;
  totalFunding: number;
  projectsActive: number;
}

export default EnhancedProject;
