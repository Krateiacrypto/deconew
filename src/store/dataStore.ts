import { create } from 'zustand';
import { Project, Investment, BlogPost, Advisor, Portfolio, AdminStats, User } from '../types';

interface DataState {
  projects: Project[];
  investments: Investment[];
  blogPosts: BlogPost[];
  advisors: Advisor[];
  portfolio: Portfolio | null;
  adminStats: AdminStats | null;
  users: User[];
  isLoading: boolean;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchInvestments: (userId: string) => Promise<void>;
  fetchBlogPosts: () => Promise<void>;
  fetchAdvisors: () => Promise<void>;
  fetchPortfolio: (userId: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Amazon Rainforest Conservation',
    description: 'Large-scale forest protection project in Brazil',
    location: 'Brazil, Amazon',
    category: 'forest',
    carbonCredits: 125000,
    price: 0.25,
    progress: 78,
    startDate: '2023-01-15',
    endDate: '2026-12-31',
    participants: 2847,
    verified: true,
    image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
    status: 'active',
    totalFunding: 3900000,
    targetFunding: 5000000,
    advisorId: '1',
    documents: [],
    riskLevel: 'medium',
    expectedReturn: 12.5,
    minimumInvestment: 100,
    createdBy: 'admin',
    approvedBy: 'admin',
    approvedAt: '2023-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Wind Energy Turkey',
    description: 'Wind farm installation in Çanakkale region',
    location: 'Çanakkale, Turkey',
    category: 'renewable',
    carbonCredits: 89000,
    price: 0.28,
    progress: 92,
    startDate: '2022-06-01',
    endDate: '2025-05-31',
    participants: 1923,
    verified: true,
    image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    status: 'active',
    totalFunding: 4600000,
    targetFunding: 5000000,
    advisorId: '2',
    documents: [],
    riskLevel: 'low',
    expectedReturn: 8.7,
    minimumInvestment: 250,
    createdBy: 'admin',
    approvedBy: 'admin',
    approvedAt: '2022-06-05T00:00:00Z'
  },
  {
    id: '3',
    title: 'Solar Energy Farm Project',
    description: 'Large-scale solar installation in Konya region',
    location: 'Konya, Turkey',
    category: 'renewable',
    carbonCredits: 67000,
    price: 0.22,
    progress: 65,
    startDate: '2023-03-01',
    endDate: '2026-02-28',
    participants: 1456,
    verified: true,
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
    status: 'pending',
    totalFunding: 2800000,
    targetFunding: 4500000,
    advisorId: '1',
    documents: [],
    riskLevel: 'medium',
    expectedReturn: 10.2,
    minimumInvestment: 150,
    createdBy: 'user1'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true,
    kycStatus: 'approved',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
    language: 'tr',
    twoFactorEnabled: false,
    emailVerified: true,
    lastLogin: '2024-01-20T14:30:00Z',
    phone: '+90 555 123 45 67',
    country: 'Turkey'
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
    createdAt: '2024-01-18T09:15:00Z',
    isActive: true,
    kycStatus: 'pending',
    language: 'en',
    twoFactorEnabled: false,
    emailVerified: true,
    lastLogin: '2024-01-19T16:45:00Z',
    phone: '+1 555 987 65 43',
    country: 'USA'
  },
  {
    id: '3',
    email: 'admin@decarbonize.world',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-12-01T00:00:00Z',
    isActive: true,
    kycStatus: 'approved',
    language: 'tr',
    twoFactorEnabled: true,
    emailVerified: true,
    lastLogin: '2024-01-20T08:00:00Z'
  }
];

const mockAdvisors: Advisor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    expertise: ['Forest Conservation', 'Carbon Credits', 'Sustainability'],
    experience: 15,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    bio: 'Environmental scientist with 15+ years in carbon credit projects',
    assignedUsers: ['1', '2'],
    languages: ['English', 'Spanish', 'Portuguese'],
    isActive: true,
    hourlyRate: 150
  },
  {
    id: '2',
    name: 'Prof. Ahmed Hassan',
    expertise: ['Renewable Energy', 'Wind Power', 'Solar Technology'],
    experience: 20,
    rating: 4.8,
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    bio: 'Renewable energy expert specializing in large-scale implementations',
    assignedUsers: ['3'],
    languages: ['English', 'Arabic', 'Turkish'],
    isActive: true,
    hourlyRate: 175
  }
];

export const useDataStore = create<DataState>((set, get) => ({
  projects: [],
  investments: [],
  blogPosts: [],
  advisors: [],
  portfolio: null,
  adminStats: null,
  users: [],
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ projects: mockProjects, isLoading: false });
  },

  fetchInvestments: async (userId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockInvestments: Investment[] = [
      {
        id: '1',
        userId,
        projectId: '1',
        amount: 5000,
        carbonCredits: 150,
        date: '2024-01-15',
        status: 'active',
        returns: 750,
        transactionHash: '0x1234567890abcdef',
        fees: 25,
        roi: 15.0
      },
      {
        id: '2',
        userId,
        projectId: '2',
        amount: 2500,
        carbonCredits: 89,
        date: '2024-01-10',
        status: 'active',
        returns: 218,
        transactionHash: '0xabcdef1234567890',
        fees: 12.5,
        roi: 8.7
      }
    ];
    
    set({ investments: mockInvestments, isLoading: false });
  },

  fetchBlogPosts: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBlogPosts: BlogPost[] = [
      {
        id: '1',
        title: 'The Future of Carbon Credits',
        content: 'Detailed analysis of carbon credit markets...',
        excerpt: 'Understanding the evolving landscape of carbon credits',
        author: 'Dr. Sarah Johnson',
        publishedAt: '2024-01-20',
        category: 'Analysis',
        tags: ['carbon', 'sustainability', 'blockchain'],
        status: 'published',
        language: 'tr',
        views: 1247
      },
      {
        id: '2',
        title: 'Blockchain Technology in Environmental Finance',
        content: 'How blockchain is revolutionizing environmental finance...',
        excerpt: 'Exploring the intersection of blockchain and green finance',
        author: 'Prof. Ahmed Hassan',
        publishedAt: '2024-01-18',
        category: 'Technology',
        tags: ['blockchain', 'finance', 'environment'],
        status: 'published',
        language: 'en',
        views: 892
      }
    ];
    
    set({ blogPosts: mockBlogPosts, isLoading: false });
  },

  fetchAdvisors: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ advisors: mockAdvisors, isLoading: false });
  },

  fetchPortfolio: async (userId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockPortfolio: Portfolio = {
      totalValue: 125450,
      totalCarbonCredits: 1247,
      totalReturns: 8945,
      investments: get().investments,
      stakingPositions: [],
      performance: {
        daily: 2.5,
        weekly: 8.3,
        monthly: 15.2,
        yearly: 45.7
      },
      allocation: [
        { category: 'Forest Conservation', percentage: 35, value: 43907.5 },
        { category: 'Renewable Energy', percentage: 28, value: 35126 },
        { category: 'Clean Technology', percentage: 22, value: 27599 },
        { category: 'Sustainable Agriculture', percentage: 15, value: 18817.5 }
      ]
    };
    
    set({ portfolio: mockPortfolio, isLoading: false });
  },

  fetchAdminStats: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAdminStats: AdminStats = {
      totalUsers: 25847,
      totalProjects: 156,
      totalInvestments: 89234,
      totalCarbonCredits: 2500000,
      platformRevenue: 15600000,
      activeUsers: 18923,
      pendingKyc: 234,
      totalStaked: 12500000,
      tradingVolume: 45600000,
      newUsersThisMonth: 1247,
      revenueThisMonth: 2340000
    };
    
    set({ adminStats: mockAdminStats, isLoading: false });
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ users: mockUsers, isLoading: false });
  },

  createProject: async (project: Omit<Project, 'id'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
      isLoading: false
    }));
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
      isLoading: false
    }));
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      isLoading: false
    }));
  },

  createBlogPost: async (post: Omit<BlogPost, 'id'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      views: 0
    };
    
    set(state => ({
      blogPosts: [...state.blogPosts, newPost],
      isLoading: false
    }));
  },

  updateBlogPost: async (id: string, updates: Partial<BlogPost>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      blogPosts: state.blogPosts.map(p => p.id === id ? { ...p, ...updates } : p),
      isLoading: false
    }));
  },

  deleteBlogPost: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      blogPosts: state.blogPosts.filter(p => p.id !== id),
      isLoading: false
    }));
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
      isLoading: false
    }));
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      users: state.users.filter(u => u.id !== id),
      isLoading: false
    }));
  }
}));