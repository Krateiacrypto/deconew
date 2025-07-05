import { create } from 'zustand';
import { ContentItem, RoadmapItem, TeamMember, Banner, ContentVersion, ContentAuditLog } from '../types/content';

interface ContentState {
  content: ContentItem[];
  roadmap: RoadmapItem[];
  team: TeamMember[];
  banners: Banner[];
  versions: ContentVersion[];
  auditLogs: ContentAuditLog[];
  isLoading: boolean;
  
  // Actions
  fetchContent: () => Promise<void>;
  fetchRoadmap: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchVersions: (contentId: string) => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  
  createContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<void>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  publishContent: (id: string) => Promise<void>;
  unpublishContent: (id: string) => Promise<void>;
  
  createRoadmapItem: (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => Promise<void>;
  deleteRoadmapItem: (id: string) => Promise<void>;
  reorderRoadmap: (items: RoadmapItem[]) => Promise<void>;
  
  createTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  reorderTeam: (members: TeamMember[]) => Promise<void>;
  
  createBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  
  restoreVersion: (contentId: string, versionId: string) => Promise<void>;
}

// Mock data
const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'mission',
    title: 'Misyonumuz',
    content: 'Blockchain teknolojisinin gücünü kullanarak karbon kredilerini tokenleştirmek, şeffaf ve erişilebilir bir karbon piyasası oluşturmak.',
    status: 'published',
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
    version: 1
  },
  {
    id: '2',
    type: 'vision',
    title: 'Vizyonumuz',
    content: 'Küresel karbon nötrleme hedeflerine ulaşılmasında öncü rol oynamak ve sürdürülebilir bir gelecek için teknoloji ile çevre koruma arasında köprü kurmak.',
    status: 'published',
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin',
    version: 1
  }
];

const mockRoadmap: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Q1 2024',
    title: 'Platform Lansmanı',
    description: 'DECARBONIZE platformunun beta versiyonu',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    items: ['ICO Başlangıcı', 'Smart Contract Denetimi', 'Community Building'],
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    phase: 'Q2 2024',
    title: 'Token Satışı',
    description: 'DCB Token public sale ve exchange listelemeleri',
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    items: ['Public Sale', 'Exchange Listelemeleri', 'Staking Protokolü'],
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Mehmet Yılmaz',
    role: 'CEO & Kurucu',
    bio: '15 yıllık çevre mühendisliği deneyimi ve blockchain teknolojileri uzmanı',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    linkedin: '#',
    order: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    role: 'CTO',
    bio: 'Blockchain geliştirme ve smart contract uzmanı, 10+ yıl teknoloji deneyimi',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    linkedin: '#',
    order: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'ICO Başladı!',
    message: 'DECARBONIZE Token ICO\'su başladı. %40 erken yatırımcı bonusu!',
    type: 'announcement',
    isActive: true,
    actionText: 'ICO\'ya Katıl',
    actionUrl: '/ico',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useContentStore = create<ContentState>((set, get) => ({
  content: [],
  roadmap: [],
  team: [],
  banners: [],
  versions: [],
  auditLogs: [],
  isLoading: false,

  fetchContent: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ content: mockContent, isLoading: false });
  },

  fetchRoadmap: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ roadmap: mockRoadmap, isLoading: false });
  },

  fetchTeam: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ team: mockTeam, isLoading: false });
  },

  fetchBanners: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ banners: mockBanners, isLoading: false });
  },

  fetchVersions: async (contentId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockVersions: ContentVersion[] = [
      {
        id: '1',
        contentId,
        version: 2,
        title: 'Updated Mission',
        content: 'Updated mission content...',
        changedBy: 'admin',
        changedAt: '2024-01-15T10:00:00Z',
        changeNote: 'Updated for clarity'
      }
    ];
    set({ versions: mockVersions, isLoading: false });
  },

  fetchAuditLogs: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockAuditLogs: ContentAuditLog[] = [
      {
        id: '1',
        contentId: '1',
        contentType: 'mission',
        action: 'update',
        userId: 'admin',
        userName: 'Admin User',
        changes: {
          content: {
            old: 'Old mission content',
            new: 'New mission content'
          }
        },
        timestamp: '2024-01-15T10:00:00Z'
      }
    ];
    set({ auditLogs: mockAuditLogs, isLoading: false });
  },

  createContent: async (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newContent: ContentItem = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
    
    set(state => ({
      content: [...state.content, newContent],
      isLoading: false
    }));
  },

  updateContent: async (id: string, updates: Partial<ContentItem>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      content: state.content.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString(), version: item.version + 1 }
          : item
      ),
      isLoading: false
    }));
  },

  deleteContent: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      content: state.content.filter(item => item.id !== id),
      isLoading: false
    }));
  },

  publishContent: async (id: string) => {
    await get().updateContent(id, { 
      status: 'published', 
      publishedAt: new Date().toISOString() 
    });
  },

  unpublishContent: async (id: string) => {
    await get().updateContent(id, { status: 'draft' });
  },

  createRoadmapItem: async (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: RoadmapItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      roadmap: [...state.roadmap, newItem],
      isLoading: false
    }));
  },

  updateRoadmapItem: async (id: string, updates: Partial<RoadmapItem>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      roadmap: state.roadmap.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ),
      isLoading: false
    }));
  },

  deleteRoadmapItem: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      roadmap: state.roadmap.filter(item => item.id !== id),
      isLoading: false
    }));
  },

  reorderRoadmap: async (items: RoadmapItem[]) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ roadmap: items, isLoading: false });
  },

  createTeamMember: async (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      team: [...state.team, newMember],
      isLoading: false
    }));
  },

  updateTeamMember: async (id: string, updates: Partial<TeamMember>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      team: state.team.map(member =>
        member.id === id
          ? { ...member, ...updates, updatedAt: new Date().toISOString() }
          : member
      ),
      isLoading: false
    }));
  },

  deleteTeamMember: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      team: state.team.filter(member => member.id !== id),
      isLoading: false
    }));
  },

  reorderTeam: async (members: TeamMember[]) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ team: members, isLoading: false });
  },

  createBanner: async (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBanner: Banner = {
      ...banner,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      banners: [...state.banners, newBanner],
      isLoading: false
    }));
  },

  updateBanner: async (id: string, updates: Partial<Banner>) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      banners: state.banners.map(banner =>
        banner.id === id
          ? { ...banner, ...updates, updatedAt: new Date().toISOString() }
          : banner
      ),
      isLoading: false
    }));
  },

  deleteBanner: async (id: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      banners: state.banners.filter(banner => banner.id !== id),
      isLoading: false
    }));
  },

  restoreVersion: async (contentId: string, versionId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    // Implementation would restore the specific version
    set({ isLoading: false });
  }
}));