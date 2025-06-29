import { create } from 'zustand';
import { Project, Investment, BlogPost, Advisor, Portfolio, AdminStats } from '../types';

interface DataState {
  projects: Project[];
  investments: Investment[];
  blogPosts: BlogPost[];
  advisors: Advisor[];
  portfolio: Portfolio | null;
  adminStats: AdminStats | null;
  isLoading: boolean;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchInvestments: (userId: string) => Promise<void>;
  fetchBlogPosts: () => Promise<void>;
  fetchAdvisors: () => Promise<void>;
  fetchPortfolio: (userId: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
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
    advisorId: '1'
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
    advisorId: '2'
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
    assignedUsers: ['user1', 'user2'],
    languages: ['English', 'Spanish', 'Portuguese']
  },
  {
    id: '2',
    name: 'Prof. Ahmed Hassan',
    expertise: ['Renewable Energy', 'Wind Power', 'Solar Technology'],
    experience: 20,
    rating: 4.8,
    avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    bio: 'Renewable energy expert specializing in large-scale implementations',
    assignedUsers: ['user3', 'user4'],
    languages: ['English', 'Arabic', 'Turkish']
  }
];

export const useDataStore = create<DataState>((set, get) => ({
  projects: [],
  investments: [],
  blogPosts: [],
  advisors: [],
  portfolio: null,
  adminStats: null,
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
        returns: 750
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
        status: 'published'
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
      performance: {
        daily: 2.5,
        weekly: 8.3,
        monthly: 15.2,
        yearly: 45.7
      }
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
      pendingKyc: 234
    };
    
    set({ adminStats: mockAdminStats, isLoading: false });
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
      id: Date.now().toString()
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
  }
}));