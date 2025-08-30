export interface User {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  walletAddress?: string;
  phone?: string;
  country?: string;
  language: 'tr' | 'en';
  twoFactorEnabled: boolean;
  lastLogin?: string;
  emailVerified: boolean;
  organizationName?: string;
  organizationType?: string;
  verificationLevel?: 'basic' | 'advanced' | 'premium';
  assignedUsers?: string[];
  specializations?: string[];
  certifications?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'user_management' | 'project_management' | 'content_management' | 'system_settings' | 'financial' | 'verification' | 'advisory';
  actions: string[];
}

export interface RolePermissions {
  role: User['role'];
  permissions: string[];
  restrictions?: {
    maxUsers?: number;
    maxProjects?: number;
    dataAccess?: 'own' | 'assigned' | 'all';
    timeRestrictions?: string[];
  };
}

export interface KYCDocument {
  id: string;
  userId: string;
  type: 'identity' | 'address' | 'income' | 'bank_statement';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface KYCApplication {
  id: string;
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  documents: KYCDocument[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology';
  carbonCredits: number;
  price: number;
  progress: number;
  startDate: string;
  endDate: string;
  participants: number;
  verified: boolean;
  image: string;
  status: 'active' | 'completed' | 'pending' | 'rejected';
  totalFunding: number;
  targetFunding: number;
  advisorId?: string;
  documents: string[];
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  minimumInvestment: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  carbonCredits: number;
  date: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  returns: number;
  transactionHash?: string;
  fees: number;
  roi: number;
}

export interface StakingPool {
  id: string;
  name: string;
  tokenSymbol: string;
  apy: number;
  minimumStake: number;
  lockPeriod: number; // days
  totalStaked: number;
  participants: number;
  status: 'active' | 'inactive';
  description: string;
}

export interface StakingPosition {
  id: string;
  userId: string;
  poolId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'withdrawn';
  rewards: number;
  lastRewardClaim?: string;
}

export interface TradingOrder {
  id: string;
  userId: string;
  pair: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  createdAt: string;
  filledAt?: string;
  fees: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  image?: string;
  status: 'draft' | 'published';
  language: 'tr' | 'en';
  views: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface Advisor {
  id: string;
  name: string;
  expertise: string[];
  experience: number;
  rating: number;
  avatar: string;
  bio: string;
  assignedUsers: string[];
  languages: string[];
  isActive: boolean;
  hourlyRate: number;
}

export interface Portfolio {
  totalValue: number;
  totalCarbonCredits: number;
  totalReturns: number;
  investments: Investment[];
  stakingPositions: StakingPosition[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  allocation: {
    category: string;
    percentage: number;
    value: number;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  totalCarbonCredits: number;
  platformRevenue: number;
  activeUsers: number;
  pendingKyc: number;
  totalStaked: number;
  tradingVolume: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
}

export interface NetworkStatus {
  blockHeight: number;
  gasPrice: string;
  tps: number;
  validators: number;
  totalStaked: string;
  apr: string;
  isHealthy: boolean;
}

export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  type: 'transfer' | 'stake' | 'unstake' | 'trade' | 'investment';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  fees: number;
  blockNumber?: number;
}