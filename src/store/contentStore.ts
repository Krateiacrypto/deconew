import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { ContentItem, RoadmapItem, TeamMember, Banner, ContentVersion, ContentAuditLog } from '../types/content';
import toast from 'react-hot-toast';

interface ContentState {
  content: ContentItem[];
  roadmap: RoadmapItem[];
  team: TeamMember[];
  banners: Banner[];
  versions: ContentVersion[];
  auditLogs: ContentAuditLog[];
  isLoading: boolean;

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
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const content: ContentItem[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        status: item.status,
        publishedAt: item.published_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        createdBy: item.created_by,
        updatedBy: item.updated_by,
        version: item.version
      }));

      set({ content, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast.error('İçerik yüklenemedi');
      set({ isLoading: false });
    }
  },

  fetchRoadmap: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('order_index');

      if (error) throw error;

      const roadmap: RoadmapItem[] = (data || []).map((item: any) => ({
        id: item.id,
        phase: item.phase,
        title: item.title,
        description: item.description,
        status: item.status,
        startDate: item.start_date,
        endDate: item.end_date,
        items: item.items || [],
        order: item.order_index,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      set({ roadmap, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching roadmap:', error);
      set({ isLoading: false });
    }
  },

  fetchTeam: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      const team: TeamMember[] = (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio,
        avatar: member.avatar,
        linkedin: member.linkedin,
        twitter: member.twitter,
        email: member.email,
        order: member.order_index,
        active: member.is_active,
        createdAt: member.created_at,
        updatedAt: member.updated_at
      }));

      set({ team, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching team:', error);
      set({ isLoading: false });
    }
  },

  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      const banners: Banner[] = (data || []).map((banner: any) => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        link: banner.link,
        buttonText: banner.button_text,
        order: banner.order_index,
        active: banner.is_active,
        startDate: banner.start_date,
        endDate: banner.end_date,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at
      }));

      set({ banners, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching banners:', error);
      set({ isLoading: false });
    }
  },

  fetchVersions: async (contentId: string) => {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      const versions: ContentVersion[] = (data || []).map((v: any) => ({
        id: v.id,
        contentId: v.content_id,
        version: v.version_number,
        title: v.title,
        content: v.content,
        createdBy: v.created_by,
        createdAt: v.created_at
      }));

      set({ versions });
    } catch (error: any) {
      console.error('Error fetching versions:', error);
    }
  },

  fetchAuditLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('content_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const auditLogs: ContentAuditLog[] = (data || []).map((log: any) => ({
        id: log.id,
        contentType: log.content_type,
        contentId: log.content_id,
        action: log.action,
        userEmail: log.user_email,
        changes: log.changes,
        createdAt: log.created_at
      }));

      set({ auditLogs });
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
    }
  },

  createContent: async (contentData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          status: contentData.status,
          created_by: user.email || 'admin',
          updated_by: user.email || 'admin'
        }])
        .select()
        .single();

      if (error) throw error;

      await get().fetchContent();
      toast.success('İçerik oluşturuldu!');
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast.error('İçerik oluşturulamadı');
      set({ isLoading: false });
    }
  },

  updateContent: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('content_items')
        .update({
          title: updates.title,
          content: updates.content,
          status: updates.status,
          updated_by: user?.email || 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchContent();
      toast.success('İçerik güncellendi!');
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast.error('İçerik güncellenemedi');
      set({ isLoading: false });
    }
  },

  deleteContent: async (id) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchContent();
      toast.success('İçerik silindi!');
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast.error('İçerik silinemedi');
    }
  },

  publishContent: async (id) => {
    await get().updateContent(id, { status: 'published', publishedAt: new Date().toISOString() });
  },

  unpublishContent: async (id) => {
    await get().updateContent(id, { status: 'draft' });
  },

  createRoadmapItem: async (itemData) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .insert([{
          phase: itemData.phase,
          title: itemData.title,
          description: itemData.description,
          status: itemData.status,
          start_date: itemData.startDate,
          end_date: itemData.endDate,
          items: itemData.items,
          order_index: itemData.order
        }])
        .select()
        .single();

      if (error) throw error;

      await get().fetchRoadmap();
      toast.success('Roadmap öğesi oluşturuldu!');
    } catch (error: any) {
      console.error('Error creating roadmap item:', error);
      toast.error('Roadmap öğesi oluşturulamadı');
    }
  },

  updateRoadmapItem: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({
          phase: updates.phase,
          title: updates.title,
          description: updates.description,
          status: updates.status,
          start_date: updates.startDate,
          end_date: updates.endDate,
          items: updates.items,
          order_index: updates.order
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchRoadmap();
      toast.success('Roadmap güncellendi!');
    } catch (error: any) {
      console.error('Error updating roadmap:', error);
      toast.error('Roadmap güncellenemedi');
    }
  },

  deleteRoadmapItem: async (id) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchRoadmap();
      toast.success('Roadmap öğesi silindi!');
    } catch (error: any) {
      console.error('Error deleting roadmap item:', error);
      toast.error('Roadmap öğesi silinemedi');
    }
  },

  reorderRoadmap: async (items) => {
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        order_index: index
      }));

      for (const update of updates) {
        await supabase
          .from('roadmap_items')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      await get().fetchRoadmap();
    } catch (error: any) {
      console.error('Error reordering roadmap:', error);
    }
  },

  createTeamMember: async (memberData) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([{
          name: memberData.name,
          role: memberData.role,
          bio: memberData.bio,
          avatar: memberData.avatar,
          linkedin: memberData.linkedin,
          twitter: memberData.twitter,
          email: memberData.email,
          order_index: memberData.order,
          is_active: memberData.active
        }]);

      if (error) throw error;

      await get().fetchTeam();
      toast.success('Ekip üyesi eklendi!');
    } catch (error: any) {
      console.error('Error creating team member:', error);
      toast.error('Ekip üyesi eklenemedi');
    }
  },

  updateTeamMember: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          name: updates.name,
          role: updates.role,
          bio: updates.bio,
          avatar: updates.avatar,
          linkedin: updates.linkedin,
          twitter: updates.twitter,
          email: updates.email,
          order_index: updates.order,
          is_active: updates.active
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchTeam();
      toast.success('Ekip üyesi güncellendi!');
    } catch (error: any) {
      console.error('Error updating team member:', error);
      toast.error('Ekip üyesi güncellenemedi');
    }
  },

  deleteTeamMember: async (id) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchTeam();
      toast.success('Ekip üyesi silindi!');
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast.error('Ekip üyesi silinemedi');
    }
  },

  reorderTeam: async (members) => {
    try {
      for (const [index, member] of members.entries()) {
        await supabase
          .from('team_members')
          .update({ order_index: index })
          .eq('id', member.id);
      }

      await get().fetchTeam();
    } catch (error: any) {
      console.error('Error reordering team:', error);
    }
  },

  createBanner: async (bannerData) => {
    try {
      const { error } = await supabase
        .from('banners')
        .insert([{
          title: bannerData.title,
          subtitle: bannerData.subtitle,
          image: bannerData.image,
          link: bannerData.link,
          button_text: bannerData.buttonText,
          order_index: bannerData.order,
          is_active: bannerData.active,
          start_date: bannerData.startDate,
          end_date: bannerData.endDate
        }]);

      if (error) throw error;

      await get().fetchBanners();
      toast.success('Banner oluşturuldu!');
    } catch (error: any) {
      console.error('Error creating banner:', error);
      toast.error('Banner oluşturulamadı');
    }
  },

  updateBanner: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({
          title: updates.title,
          subtitle: updates.subtitle,
          image: updates.image,
          link: updates.link,
          button_text: updates.buttonText,
          order_index: updates.order,
          is_active: updates.active,
          start_date: updates.startDate,
          end_date: updates.endDate
        })
        .eq('id', id);

      if (error) throw error;

      await get().fetchBanners();
      toast.success('Banner güncellendi!');
    } catch (error: any) {
      console.error('Error updating banner:', error);
      toast.error('Banner güncellenemedi');
    }
  },

  deleteBanner: async (id) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchBanners();
      toast.success('Banner silindi!');
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      toast.error('Banner silinemedi');
    }
  },

  restoreVersion: async (contentId, versionId) => {
    try {
      const { data: version } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (version) {
        await get().updateContent(contentId, {
          title: version.title,
          content: version.content
        });
      }
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast.error('Versiyon geri yüklenemedi');
    }
  }
}));
