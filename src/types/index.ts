export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'advisor';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  walletAddress?: string;
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
  status: 'active' | 'completed' | 'pending';
  totalFunding: number;
  targetFunding: number;
  advisorId?: string;
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  carbonCredits: number;
  date: string;
  status: 'active' | 'completed' | 'pending';
  returns: number;
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
}

export interface Portfolio {
  totalValue: number;
  totalCarbonCredits: number;
  totalReturns: number;
  investments: Investment[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  totalCarbonCredits: number;
  platformRevenue: number;
  activeUsers: number;
  pendingKyc: number;
}