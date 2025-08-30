import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost, BlogComment, BlogCategory, BlogStats, BlogFilters, PaginationInfo } from '../types/blog';

interface BlogState {
  posts: BlogPost[];
  comments: BlogComment[];
  categories: BlogCategory[];
  stats: BlogStats;
  isLoading: boolean;
  
  // Actions
  fetchPosts: (filters?: BlogFilters, page?: number, limit?: number) => Promise<{ posts: BlogPost[]; pagination: PaginationInfo }>;
  fetchPost: (slug: string) => Promise<BlogPost | null>;
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'slug'>) => Promise<BlogPost>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  unpublishPost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  
  // Comments
  fetchComments: (postId: string) => Promise<BlogComment[]>;
  addComment: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  approveComment: (id: string) => Promise<void>;
  
  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<BlogCategory, 'id' | 'postCount'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<BlogCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Stats
  fetchStats: () => Promise<void>;
  
  // Search
  searchPosts: (query: string) => Promise<BlogPost[]>;
}

// Helper functions
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Initial data
const initialCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Karbon Kredisi',
    slug: 'karbon-kredisi',
    description: 'Karbon kredisi piyasası ve tokenleştirme',
    color: '#10b981',
    postCount: 0
  },
  {
    id: '2',
    name: 'Sürdürülebilirlik',
    slug: 'surdurulebilirlik',
    description: 'Çevre koruma ve sürdürülebilir kalkınma',
    color: '#3b82f6',
    postCount: 0
  },
  {
    id: '3',
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Blockchain teknolojisi ve uygulamaları',
    color: '#8b5cf6',
    postCount: 0
  },
  {
    id: '4',
    name: 'Yenilenebilir Enerji',
    slug: 'yenilenebilir-enerji',
    description: 'Temiz enerji teknolojileri',
    color: '#f59e0b',
    postCount: 0
  }
];

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Karbon Kredisi Piyasasının Geleceği ve Blockchain Teknolojisi',
    content: `
      <h2>Karbon Kredisi Nedir?</h2>
      <p>Karbon kredisi, atmosfere salınan sera gazı emisyonlarını azaltmak veya absorbe etmek için kullanılan bir piyasa mekanizmasıdır. Her bir karbon kredisi, bir ton karbondioksit eşdeğeri (tCO2e) emisyon azaltımını temsil eder.</p>
      
      <h3>Blockchain'in Karbon Kredisi Piyasasına Katkıları</h3>
      <p>Blockchain teknolojisi, karbon kredisi piyasasında şeffaflık, güvenilirlik ve erişilebilirlik sağlayarak devrim yaratmaktadır:</p>
      
      <ul>
        <li><strong>Şeffaflık:</strong> Tüm işlemler blockchain üzerinde kaydedilir</li>
        <li><strong>Doğrulanabilirlik:</strong> Karbon kredilerinin kaynağı ve geçmişi takip edilebilir</li>
        <li><strong>Likidite:</strong> Tokenleştirme ile daha likit bir piyasa oluşur</li>
        <li><strong>Erişilebilirlik:</strong> Küçük yatırımcılar da piyasaya katılabilir</li>
      </ul>
      
      <h3>DECARBONIZE Token'ın Rolü</h3>
      <p>DECARBONIZE Token (DCB), karbon kredilerini tokenleştirerek bu avantajları gerçek dünyaya taşımaktadır. ReefChain altyapısı sayesinde düşük maliyetli ve hızlı işlemler mümkün olmaktadır.</p>
      
      <blockquote>
        <p>"Karbon kredisi piyasası 2030 yılına kadar 100 milyar doları aşacak. Blockchain teknolojisi bu büyümede kritik rol oynayacak."</p>
      </blockquote>
      
      <p>Gelecekte karbon kredisi piyasasının daha da büyümesi ve blockchain entegrasyonunun artması beklenmektedir.</p>
    `,
    excerpt: 'Blockchain teknolojisinin karbon kredisi piyasasına getirdiği yenilikler ve gelecek projeksiyonları hakkında kapsamlı analiz.',
    author: 'Dr. Sarah Johnson',
    authorAvatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    publishedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    category: 'Karbon Kredisi',
    tags: ['karbon kredisi', 'blockchain', 'tokenleştirme', 'sürdürülebilirlik'],
    coverImage: 'https://images.pexels.com/photos/9324302/pexels-photo-9324302.jpeg',
    status: 'published',
    language: 'tr',
    views: 1247,
    likes: 89,
    readTime: 8,
    slug: 'karbon-kredisi-piyasasinin-gelecegi-ve-blockchain-teknolojisi',
    seoTitle: 'Karbon Kredisi Piyasasının Geleceği | DECARBONIZE Blog',
    seoDescription: 'Blockchain teknolojisinin karbon kredisi piyasasına etkilerini keşfedin. Tokenleştirme ve sürdürülebilir yatırım fırsatları.'
  },
  {
    id: '2',
    title: 'Sürdürülebilir Yatırımların Yükselişi: ESG Kriterleri ve Karbon Nötrleme',
    content: `
      <h2>ESG Yatırımları Nedir?</h2>
      <p>ESG (Environmental, Social, Governance) kriterleri, yatırım kararlarında çevresel, sosyal ve yönetişim faktörlerini dikkate alan bir yaklaşımdır.</p>
      
      <h3>Çevresel Kriterler (Environmental)</h3>
      <p>Şirketlerin çevre üzerindeki etkilerini değerlendiren kriterler:</p>
      <ul>
        <li>Karbon ayak izi ve emisyon azaltımı</li>
        <li>Yenilenebilir enerji kullanımı</li>
        <li>Atık yönetimi ve geri dönüşüm</li>
        <li>Su kullanımı ve koruma</li>
      </ul>
      
      <h3>Karbon Nötrleme Projelerinin Önemi</h3>
      <p>Karbon nötrleme projeleri, ESG yatırımlarının en önemli bileşenlerinden biridir. Bu projeler:</p>
      
      <ol>
        <li>Atmosferdeki CO2 miktarını azaltır</li>
        <li>Biyoçeşitliliği korur</li>
        <li>Yerel toplulukları destekler</li>
        <li>Sürdürülebilir kalkınmaya katkıda bulunur</li>
      </ol>
      
      <h3>Yatırım Fırsatları</h3>
      <p>DECARBONIZE platformu üzerinden karbon nötrleme projelerine yatırım yaparak hem çevreyi koruyabilir hem de finansal getiri elde edebilirsiniz.</p>
    `,
    excerpt: 'ESG kriterlerinin yatırım kararlarındaki artan önemi ve karbon nötrleme projelerinin sürdürülebilir yatırımlardaki rolü.',
    author: 'Prof. Ahmed Hassan',
    authorAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
    publishedAt: '2024-01-18T14:30:00Z',
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    category: 'Sürdürülebilirlik',
    tags: ['ESG', 'sürdürülebilir yatırım', 'karbon nötrleme', 'çevre'],
    coverImage: 'https://images.pexels.com/photos/9324301/pexels-photo-9324301.jpeg',
    status: 'published',
    language: 'tr',
    views: 892,
    likes: 67,
    readTime: 6,
    slug: 'surdurulebilir-yatirimlarin-yukselisi-esg-kriterleri',
    seoTitle: 'Sürdürülebilir Yatırımların Yükselişi | ESG Kriterleri',
    seoDescription: 'ESG kriterlerinin önemini ve karbon nötrleme projelerinin yatırım fırsatlarını keşfedin.'
  },
  {
    id: '3',
    title: 'ReefChain Altyapısı: Çevre Dostu Blockchain Çözümü',
    content: `
      <h2>ReefChain Nedir?</h2>
      <p>ReefChain, Polkadot ekosistemi üzerine kurulmuş, EVM uyumlu bir blockchain platformudur. Düşük enerji tüketimi ve yüksek performansı ile çevre dostu blockchain çözümleri sunar.</p>
      
      <h3>Çevre Dostu Özellikler</h3>
      <p>ReefChain'in çevresel avantajları:</p>
      
      <ul>
        <li><strong>Düşük Enerji Tüketimi:</strong> Proof of Stake konsensüs mekanizması</li>
        <li><strong>Karbon Nötr:</strong> Enerji tüketimi karbon offsetting ile dengelenir</li>
        <li><strong>Verimli İşlemler:</strong> Saniyede 1000+ işlem kapasitesi</li>
        <li><strong>Düşük Ücretler:</strong> İşlem başına ~$0.001 maliyet</li>
      </ul>
      
      <h3>DECARBONIZE Entegrasyonu</h3>
      <p>DECARBONIZE Token, ReefChain'in bu avantajlarından yararlanarak:</p>
      
      <ol>
        <li>Karbon kredilerini düşük maliyetle tokenleştirir</li>
        <li>Hızlı ve güvenli işlemler sağlar</li>
        <li>Çevresel etkiyi minimize eder</li>
        <li>Global erişilebilirlik sunar</li>
      </ol>
      
      <p>Bu teknolojik altyapı sayesinde karbon kredisi ticareti daha erişilebilir ve verimli hale gelmektedir.</p>
    `,
    excerpt: 'ReefChain blockchain altyapısının çevre dostu özellikleri ve DECARBONIZE Token entegrasyonu.',
    author: 'Ayşe Demir',
    authorAvatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg',
    publishedAt: '2024-01-16T11:15:00Z',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T11:15:00Z',
    category: 'Blockchain',
    tags: ['ReefChain', 'blockchain', 'çevre dostu', 'teknoloji'],
    coverImage: 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg',
    status: 'published',
    language: 'tr',
    views: 634,
    likes: 45,
    readTime: 5,
    slug: 'reefchain-altyapisi-cevre-dostu-blockchain-cozumu',
    seoTitle: 'ReefChain: Çevre Dostu Blockchain Altyapısı',
    seoDescription: 'ReefChain blockchain teknolojisinin çevre dostu özelliklerini ve DECARBONIZE Token entegrasyonunu öğrenin.'
  },
  {
    id: '4',
    title: 'Yenilenebilir Enerji Projelerine Yatırım: Fırsatlar ve Riskler',
    content: `
      <h2>Yenilenebilir Enerji Sektörüne Genel Bakış</h2>
      <p>Yenilenebilir enerji sektörü, küresel enerji dönüşümünün merkezinde yer almaktadır. Güneş, rüzgar, hidroelektrik ve diğer temiz enerji kaynakları, fosil yakıtlara alternatif sunmaktadır.</p>
      
      <h3>Yatırım Fırsatları</h3>
      <p>Yenilenebilir enerji projelerinde yatırım fırsatları:</p>
      
      <ul>
        <li><strong>Güneş Enerjisi:</strong> Teknoloji maliyetlerinin düşmesi ile artan karlılık</li>
        <li><strong>Rüzgar Enerjisi:</strong> Offshore projelerinde büyük potansiyel</li>
        <li><strong>Hidroelektrik:</strong> Uzun vadeli istikrarlı getiri</li>
        <li><strong>Enerji Depolama:</strong> Batarya teknolojilerinde gelişim</li>
      </ul>
      
      <h3>Risk Faktörleri</h3>
      <p>Yatırım yaparken dikkat edilmesi gereken riskler:</p>
      
      <ol>
        <li>Teknolojik değişimler ve eskime riski</li>
        <li>Düzenleyici değişiklikler</li>
        <li>Hava durumu ve coğrafi faktörler</li>
        <li>Grid entegrasyon zorlukları</li>
      </ol>
      
      <h3>DECARBONIZE Platformu Avantajları</h3>
      <p>DECARBONIZE platformu üzerinden yenilenebilir enerji projelerine yatırım yapmanın avantajları:</p>
      
      <ul>
        <li>Düşük minimum yatırım miktarları</li>
        <li>Çeşitlendirilmiş proje portföyü</li>
        <li>Uzman danışman desteği</li>
        <li>Blockchain tabanlı şeffaflık</li>
      </ul>
    `,
    excerpt: 'Yenilenebilir enerji projelerindeki yatırım fırsatları, risk faktörleri ve DECARBONIZE platformunun sunduğu avantajlar.',
    author: 'Dr. Mehmet Yılmaz',
    authorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    publishedAt: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    category: 'Yenilenebilir Enerji',
    tags: ['yenilenebilir enerji', 'yatırım', 'güneş enerjisi', 'rüzgar enerjisi'],
    coverImage: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    status: 'published',
    language: 'tr',
    views: 756,
    likes: 52,
    readTime: 7,
    slug: 'yenilenebilir-enerji-projelerine-yatirim-firsatlar-ve-riskler',
    seoTitle: 'Yenilenebilir Enerji Yatırımları | Fırsatlar ve Riskler',
    seoDescription: 'Yenilenebilir enerji projelerindeki yatırım fırsatlarını ve risk faktörlerini detaylı olarak inceleyin.'
  }
];

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: [],
      comments: [],
      categories: [],
      stats: {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        publishedPosts: 0,
        draftPosts: 0
      },
      isLoading: false,

      fetchPosts: async (filters?: BlogFilters, page = 1, limit = 10) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let { posts } = get();
        
        // Initialize with sample data if empty
        if (posts.length === 0) {
          posts = initialPosts;
          set({ posts });
        }
        
        // Apply filters
        let filteredPosts = [...posts];
        
        if (filters?.category) {
          filteredPosts = filteredPosts.filter(post => post.category === filters.category);
        }
        
        if (filters?.tag) {
          filteredPosts = filteredPosts.filter(post => post.tags.includes(filters.tag));
        }
        
        if (filters?.author) {
          filteredPosts = filteredPosts.filter(post => post.author === filters.author);
        }
        
        if (filters?.status) {
          filteredPosts = filteredPosts.filter(post => post.status === filters.status);
        }
        
        // Sort by published date (newest first)
        filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        
        // Pagination
        const totalItems = filteredPosts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
        
        const pagination: PaginationInfo = {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit
        };
        
        set({ isLoading: false });
        return { posts: paginatedPosts, pagination };
      },

      fetchPost: async (slug: string) => {
        const { posts } = get();
        return posts.find(post => post.slug === slug) || null;
      },

      createPost: async (postData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newPost: BlogPost = {
          ...postData,
          id: generateId(),
          slug: generateSlug(postData.title),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          readTime: calculateReadTime(postData.content)
        };
        
        set(state => ({
          posts: [newPost, ...state.posts],
          isLoading: false
        }));
        
        return newPost;
      },

      updatePost: async (id: string, updates: Partial<BlogPost>) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        set(state => ({
          posts: state.posts.map(post =>
            post.id === id
              ? {
                  ...post,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  slug: updates.title ? generateSlug(updates.title) : post.slug,
                  readTime: updates.content ? calculateReadTime(updates.content) : post.readTime
                }
              : post
          ),
          isLoading: false
        }));
      },

      deletePost: async (id: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        set(state => ({
          posts: state.posts.filter(post => post.id !== id),
          comments: state.comments.filter(comment => comment.postId !== id),
          isLoading: false
        }));
      },

      publishPost: async (id: string) => {
        await get().updatePost(id, { 
          status: 'published', 
          publishedAt: new Date().toISOString() 
        });
      },

      unpublishPost: async (id: string) => {
        await get().updatePost(id, { status: 'draft' });
      },

      likePost: async (id: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
          )
        }));
      },

      incrementViews: async (id: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, views: post.views + 1 } : post
          )
        }));
      },

      fetchComments: async (postId: string) => {
        const { comments } = get();
        return comments.filter(comment => comment.postId === postId);
      },

      addComment: async (commentData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newComment: BlogComment = {
          ...commentData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          likes: 0,
          isApproved: true // Auto-approve for demo
        };
        
        set(state => ({
          comments: [...state.comments, newComment],
          isLoading: false
        }));
      },

      likeComment: async (id: string) => {
        set(state => ({
          comments: state.comments.map(comment =>
            comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
          )
        }));
      },

      deleteComment: async (id: string) => {
        set(state => ({
          comments: state.comments.filter(comment => comment.id !== id)
        }));
      },

      approveComment: async (id: string) => {
        set(state => ({
          comments: state.comments.map(comment =>
            comment.id === id ? { ...comment, isApproved: true } : comment
          )
        }));
      },

      fetchCategories: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        let { categories, posts } = get();
        
        if (categories.length === 0) {
          categories = initialCategories;
        }
        
        // Update post counts
        const updatedCategories = categories.map(category => ({
          ...category,
          postCount: posts.filter(post => post.category === category.name && post.status === 'published').length
        }));
        
        set({ categories: updatedCategories, isLoading: false });
      },

      createCategory: async (categoryData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newCategory: BlogCategory = {
          ...categoryData,
          id: generateId(),
          postCount: 0
        };
        
        set(state => ({
          categories: [...state.categories, newCategory],
          isLoading: false
        }));
      },

      updateCategory: async (id: string, updates: Partial<BlogCategory>) => {
        set(state => ({
          categories: state.categories.map(category =>
            category.id === id ? { ...category, ...updates } : category
          )
        }));
      },

      deleteCategory: async (id: string) => {
        set(state => ({
          categories: state.categories.filter(category => category.id !== id)
        }));
      },

      fetchStats: async () => {
        const { posts, comments } = get();
        
        const stats: BlogStats = {
          totalPosts: posts.length,
          totalViews: posts.reduce((sum, post) => sum + post.views, 0),
          totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
          totalComments: comments.length,
          publishedPosts: posts.filter(post => post.status === 'published').length,
          draftPosts: posts.filter(post => post.status === 'draft').length
        };
        
        set({ stats });
      },

      searchPosts: async (query: string) => {
        const { posts } = get();
        
        const searchResults = posts.filter(post => {
          const searchText = `${post.title} ${post.content} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
          return searchText.includes(query.toLowerCase()) && post.status === 'published';
        });
        
        return searchResults;
      }
    }),
    {
      name: 'blog-storage',
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
        categories: state.categories
      })
    }
  )
);