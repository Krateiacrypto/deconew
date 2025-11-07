import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Project, Investment, Advisor, Portfolio, AdminStats, User } from '../types';
import toast from 'react-hot-toast';

interface DataState {
  projects: Project[];
  investments: Investment[];
  advisors: Advisor[];
  portfolio: Portfolio | null;
  adminStats: AdminStats | null;
  users: User[];
  isLoading: boolean;
  lastFetch: { [key: string]: number };
  cacheTimeout: number;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchInvestments: (userId: string) => Promise<void>;
  fetchAdvisors: () => Promise<void>;
  fetchPortfolio: (userId: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  fetchUsers: (forceRefresh?: boolean) => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

// Convert DB snake_case to camelCase
const convertDbProject = (db: any): Project => ({
  id: db.id,
  title: db.title,
  description: db.description,
  location: db.location,
  category: db.category,
  carbonCredits: db.carbon_credits,
  price: parseFloat(db.price),
  progress: db.progress,
  startDate: db.start_date,
  endDate: db.end_date,
  participants: db.participants,
  verified: db.verified,
  image: db.image,
  status: db.status,
  totalFunding: parseFloat(db.total_funding),
  targetFunding: parseFloat(db.target_funding),
  advisorId: db.advisor_id,
  documents: db.documents || [],
  riskLevel: db.risk_level,
  expectedReturn: parseFloat(db.expected_return),
  minimumInvestment: parseFloat(db.minimum_investment),
  createdBy: db.created_by,
  approvedBy: db.approved_by,
  approvedAt: db.approved_at
});

const convertProjectToDb = (project: Partial<Project>) => ({
  title: project.title,
  description: project.description,
  location: project.location,
  category: project.category,
  carbon_credits: project.carbonCredits,
  price: project.price,
  progress: project.progress,
  start_date: project.startDate,
  end_date: project.endDate,
  participants: project.participants,
  verified: project.verified,
  image: project.image,
  status: project.status,
  total_funding: project.totalFunding,
  target_funding: project.targetFunding,
  advisor_id: project.advisorId,
  documents: project.documents,
  risk_level: project.riskLevel,
  expected_return: project.expectedReturn,
  minimum_investment: project.minimumInvestment,
  created_by: project.createdBy,
  approved_by: project.approvedBy,
  approved_at: project.approvedAt
});

const convertDbAdvisor = (db: any): Advisor => ({
  id: db.id,
  name: db.name,
  title: db.title,
  bio: db.bio,
  avatar: db.avatar,
  expertise: db.expertise || [],
  languages: db.languages || [],
  rating: parseFloat(db.rating),
  totalConsultations: db.total_consultations,
  hourlyRate: parseFloat(db.hourly_rate),
  available: db.is_available
});

export const useDataStore = create<DataState>((set, get) => ({
  projects: [],
  investments: [],
  advisors: [],
  portfolio: null,
  adminStats: null,
  users: [],
  isLoading: false,
  lastFetch: {},
  cacheTimeout: 30000,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projects = (data || []).map(convertDbProject);
      set({ projects, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Projeler yüklenemedi');
      set({ isLoading: false });
    }
  },

  fetchInvestments: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('invested_at', { ascending: false });

      if (error) throw error;

      const investments: Investment[] = (data || []).map((inv: any) => ({
        id: inv.id,
        userId: inv.user_id,
        projectId: inv.project_id,
        amount: parseFloat(inv.amount),
        carbonCredits: inv.carbon_credits,
        investedAt: inv.invested_at,
        status: inv.status,
        returns: parseFloat(inv.returns || 0),
        returnDate: inv.return_date
      }));

      set({ investments, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching investments:', error);
      toast.error('Yatırımlar yüklenemedi');
      set({ isLoading: false });
    }
  },

  fetchAdvisors: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;

      const advisors = (data || []).map(convertDbAdvisor);
      set({ advisors, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching advisors:', error);
      toast.error('Danışmanlar yüklenemedi');
      set({ isLoading: false });
    }
  },

  fetchPortfolio: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Fetch user's investments
      const { data: investments, error: invError } = await supabase
        .from('investments')
        .select('*, projects(*)')
        .eq('user_id', userId);

      if (invError) throw invError;

      // Calculate portfolio stats
      const totalInvested = investments?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;
      const totalReturns = investments?.reduce((sum, inv) => sum + parseFloat(inv.returns || 0), 0) || 0;
      const totalCarbonCredits = investments?.reduce((sum, inv) => sum + (inv.carbon_credits || 0), 0) || 0;

      const portfolio: Portfolio = {
        userId,
        totalInvested,
        totalReturns,
        totalCarbonCredits,
        activeProjects: investments?.filter(inv => inv.status === 'active').length || 0,
        performance: totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0,
        investments: investments || []
      };

      set({ portfolio, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      toast.error('Portföy yüklenemedi');
      set({ isLoading: false });
    }
  },

  fetchAdminStats: async () => {
    set({ isLoading: true });
    try {
      // Get counts from all tables
      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalInvestments },
        { data: investments }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('investments').select('*', { count: 'exact', head: true }),
        supabase.from('investments').select('amount')
      ]);

      const totalInvested = investments?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;

      const adminStats: AdminStats = {
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        totalInvestments: totalInvestments || 0,
        totalVolume: totalInvested,
        activeUsers: 0,
        pendingKYC: 0,
        recentActivity: []
      };

      set({ adminStats, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      set({ isLoading: false });
    }
  },

  fetchUsers: async (forceRefresh = false) => {
    const now = Date.now();
    const { lastFetch, cacheTimeout, users } = get();

    if (!forceRefresh && users.length > 0 && lastFetch['users'] && (now - lastFetch['users']) < cacheTimeout) {
      return;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fetchedUsers: User[] = (data || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        createdAt: u.created_at,
        isActive: u.is_active,
        kycStatus: u.kyc_status,
        kycLevel: u.kyc_level || 'level_1',
        investorTier: u.investor_tier,
        minimumInvestment: u.minimum_investment,
        monthlyLimit: u.monthly_limit,
        tradingFeeRate: u.trading_fee_rate,
        stakingMultiplier: u.staking_multiplier,
        tierUpgradedAt: u.tier_upgraded_at,
        tierBenefits: u.tier_benefits,
        walletAddress: u.wallet_address,
        phone: u.phone,
        country: u.country,
        language: u.language || 'tr',
        twoFactorEnabled: u.two_factor_enabled || false,
        lastLogin: u.last_login,
        emailVerified: u.email_verified || false,
        organizationName: u.organization_name,
        organizationType: u.organization_type,
        verificationLevel: u.verification_level,
        assignedUsers: u.assigned_users || [],
        specializations: u.specializations || [],
        certifications: u.certifications || []
      }));

      set({
        users: fetchedUsers,
        isLoading: false,
        lastFetch: { ...lastFetch, users: now }
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcılar yüklenemedi');
      set({ isLoading: false });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbProject = {
        ...convertProjectToDb(projectData as Project),
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([dbProject])
        .select()
        .single();

      if (error) throw error;

      const newProject = convertDbProject(data);
      const { projects } = get();

      set({
        projects: [newProject, ...projects],
        isLoading: false
      });

      toast.success('Proje oluşturuldu!');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error('Proje oluşturulamadı: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    set({ isLoading: true });
    try {
      const dbUpdates = {
        ...convertProjectToDb(updates),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProject = convertDbProject(data);
      const { projects } = get();

      set({
        projects: projects.map(p => p.id === id ? updatedProject : p),
        isLoading: false
      });

      toast.success('Proje güncellendi!');
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Proje güncellenemedi: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { projects } = get();
      set({
        projects: projects.filter(p => p.id !== id),
        isLoading: false
      });

      toast.success('Proje silindi!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Proje silinemedi: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    set({ isLoading: true });
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.kycStatus) dbUpdates.kyc_status = updates.kycStatus;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.walletAddress) dbUpdates.wallet_address = updates.walletAddress;
      if (updates.organizationName) dbUpdates.organization_name = updates.organizationName;
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { users } = get();
      set({
        users: users.map(u => u.id === id ? {
          ...u,
          ...updates,
          kycStatus: data.kyc_status,
          walletAddress: data.wallet_address,
          isActive: data.is_active,
          organizationName: data.organization_name
        } : u),
        isLoading: false
      });

      toast.success('Kullanıcı güncellendi!');
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Kullanıcı güncellenemedi');
      set({ isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { users } = get();
      set({
        users: users.filter(u => u.id !== id),
        isLoading: false
      });

      toast.success('Kullanıcı silindi!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Kullanıcı silinemedi');
      set({ isLoading: false });
      throw error;
    }
  }
}));
