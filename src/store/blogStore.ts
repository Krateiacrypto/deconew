import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { BlogPost, BlogComment, BlogCategory, BlogStats, BlogFilters, PaginationInfo } from '../types/blog';
import { generateSlug, calculateReadTime, extractExcerpt } from '../utils/markdown';
import toast from 'react-hot-toast';

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

// Helper function
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

// Initial sample data
const getInitialData = () => {
  const initialPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Karbon Kredisi Piyasasının Geleceği ve Blockchain Teknolojisi',
      content: `<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Karbon Kredisi Nedir?</h2>
<p class="mb-4">Karbon kredisi, atmosfere salınan sera gazı emisyonlarını azaltmak veya absorbe etmek için kullanılan bir piyasa mekanizmasıdır. Her bir karbon kredisi, bir ton karbondioksit eşdeğeri (tCO2e) emisyon azaltımını temsil eder.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Blockchain'in Karbon Kredisi Piyasasına Katkıları</h3>
<p class="mb-4">Blockchain teknolojisi, karbon kredisi piyasasında şeffaflık, güvenilirlik ve erişilebilirlik sağlayarak devrim yaratmaktadır:</p>

<ul class="list-disc list-inside mb-4 space-y-2">
  <li><strong class="font-semibold">Şeffaflık:</strong> Tüm işlemler blockchain üzerinde kaydedilir</li>
  <li><strong class="font-semibold">Doğrulanabilirlik:</strong> Karbon kredilerinin kaynağı ve geçmişi takip edilebilir</li>
  <li><strong class="font-semibold">Likidite:</strong> Tokenleştirme ile daha likit bir piyasa oluşur</li>
  <li><strong class="font-semibold">Erişilebilirlik:</strong> Küçük yatırımcılar da piyasaya katılabilir</li>
</ul>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">DECARBONIZE Token'ın Rolü</h3>
<p class="mb-4">DECARBONIZE Token (DCB), karbon kredilerini tokenleştirerek bu avantajları gerçek dünyaya taşımaktadır. ReefChain altyapısı sayesinde düşük maliyetli ve hızlı işlemler mümkün olmaktadır.</p>

<blockquote class="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50 italic text-gray-700">
  <p>"Karbon kredisi piyasası 2030 yılına kadar 100 milyar doları aşacak. Blockchain teknolojisi bu büyümede kritik rol oynayacak."</p>
</blockquote>

<p class="mb-4">Gelecekte karbon kredisi piyasasının daha da büyümesi ve blockchain entegrasyonunun artması beklenmektedir.</p>`,
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
      content: `<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">ESG Yatırımları Nedir?</h2>
<p class="mb-4">ESG (Environmental, Social, Governance) kriterleri, yatırım kararlarında çevresel, sosyal ve yönetişim faktörlerini dikkate alan bir yaklaşımdır.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Çevresel Kriterler (Environmental)</h3>
<p class="mb-4">Şirketlerin çevre üzerindeki etkilerini değerlendiren kriterler:</p>
<ul class="list-disc list-inside mb-4 space-y-2">
  <li>Karbon ayak izi ve emisyon azaltımı</li>
  <li>Yenilenebilir enerji kullanımı</li>
  <li>Atık yönetimi ve geri dönüşüm</li>
  <li>Su kullanımı ve koruma</li>
</ul>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Karbon Nötrleme Projelerinin Önemi</h3>
<p class="mb-4">Karbon nötrleme projeleri, ESG yatırımlarının en önemli bileşenlerinden biridir. Bu projeler:</p>

<ol class="list-decimal list-inside mb-4 space-y-2">
  <li>Atmosferdeki CO2 miktarını azaltır</li>
  <li>Biyoçeşitliliği korur</li>
  <li>Yerel toplulukları destekler</li>
  <li>Sürdürülebilir kalkınmaya katkıda bulunur</li>
</ol>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Yatırım Fırsatları</h3>
<p class="mb-4">DECARBONIZE platformu üzerinden karbon nötrleme projelerine yatırım yaparak hem çevreyi koruyabilir hem de finansal getiri elde edebilirsiniz.</p>`,
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
      content: `<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">ReefChain Nedir?</h2>
<p class="mb-4">ReefChain, Polkadot ekosistemi üzerine kurulmuş, EVM uyumlu bir blockchain platformudur. Düşük enerji tüketimi ve yüksek performansı ile çevre dostu blockchain çözümleri sunar.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Çevre Dostu Özellikler</h3>
<p class="mb-4">ReefChain'in çevresel avantajları:</p>

<ul class="list-disc list-inside mb-4 space-y-2">
  <li><strong class="font-semibold">Düşük Enerji Tüketimi:</strong> Proof of Stake konsensüs mekanizması</li>
  <li><strong class="font-semibold">Karbon Nötr:</strong> Enerji tüketimi karbon offsetting ile dengelenir</li>
  <li><strong class="font-semibold">Verimli İşlemler:</strong> Saniyede 1000+ işlem kapasitesi</li>
  <li><strong class="font-semibold">Düşük Ücretler:</strong> İşlem başına ~$0.001 maliyet</li>
</ul>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">DECARBONIZE Entegrasyonu</h3>
<p class="mb-4">DECARBONIZE Token, ReefChain'in bu avantajlarından yararlanarak:</p>

<ol class="list-decimal list-inside mb-4 space-y-2">
  <li>Karbon kredilerini düşük maliyetle tokenleştirir</li>
  <li>Hızlı ve güvenli işlemler sağlar</li>
  <li>Çevresel etkiyi minimize eder</li>
  <li>Global erişilebilirlik sunar</li>
</ol>

<p class="mb-4">Bu teknolojik altyapı sayesinde karbon kredisi ticareti daha erişilebilir ve verimli hale gelmektedir.</p>`,
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
      content: `<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Yenilenebilir Enerji Sektörüne Genel Bakış</h2>
<p class="mb-4">Yenilenebilir enerji sektörü, küresel enerji dönüşümünün merkezinde yer almaktadır. Güneş, rüzgar, hidroelektrik ve diğer temiz enerji kaynakları, fosil yakıtlara alternatif sunmaktadır.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Yatırım Fırsatları</h3>
<p class="mb-4">Yenilenebilir enerji projelerinde yatırım fırsatları:</p>

<ul class="list-disc list-inside mb-4 space-y-2">
  <li><strong class="font-semibold">Güneş Enerjisi:</strong> Teknoloji maliyetlerinin düşmesi ile artan karlılık</li>
  <li><strong class="font-semibold">Rüzgar Enerjisi:</strong> Offshore projelerinde büyük potansiyel</li>
  <li><strong class="font-semibold">Hidroelektrik:</strong> Uzun vadeli istikrarlı getiri</li>
  <li><strong class="font-semibold">Enerji Depolama:</strong> Batarya teknolojilerinde gelişim</li>
</ul>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Risk Faktörleri</h3>
<p class="mb-4">Yatırım yaparken dikkat edilmesi gereken riskler:</p>

<ol class="list-decimal list-inside mb-4 space-y-2">
  <li>Teknolojik değişimler ve eskime riski</li>
  <li>Düzenleyici değişiklikler</li>
  <li>Hava durumu ve coğrafi faktörler</li>
  <li>Grid entegrasyon zorlukları</li>
</ol>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">DECARBONIZE Platformu Avantajları</h3>
<p class="mb-4">DECARBONIZE platformu üzerinden yenilenebilir enerji projelerine yatırım yapmanın avantajları:</p>

<ul class="list-disc list-inside mb-4 space-y-2">
  <li>Düşük minimum yatırım miktarları</li>
  <li>Çeşitlendirilmiş proje portföyü</li>
  <li>Uzman danışman desteği</li>
  <li>Blockchain tabanlı şeffaflık</li>
</ul>`,
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
    },
    {
      id: '5',
      title: 'Orman Koruma Projelerinin Karbon Kredisi Potansiyeli',
      content: `<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Ormanların İklim Değişikliğindeki Rolü</h2>
<p class="mb-4">Ormanlar, atmosferdeki karbondioksiti absorbe ederek iklim değişikliği ile mücadelede kritik rol oynamaktadır. Bir hektar orman yılda ortalama 2.6 ton CO2 absorbe edebilmektedir.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Orman Koruma Projelerinin Türleri</h3>
<ul class="list-disc list-inside mb-4 space-y-2">
  <li><strong class="font-semibold">REDD+ Projeleri:</strong> Ormansızlaşma ve orman bozulmasının azaltılması</li>
  <li><strong class="font-semibold">Afforestation:</strong> Yeni orman alanlarının oluşturulması</li>
  <li><strong class="font-semibold">Reforestation:</strong> Bozulmuş orman alanlarının restore edilmesi</li>
  <li><strong class="font-semibold">Sürdürülebilir Orman Yönetimi:</strong> Mevcut ormanların korunması</li>
</ul>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Karbon Kredisi Hesaplama</h3>
<p class="mb-4">Orman projelerinde karbon kredisi hesaplaması karmaşık bir süreçtir:</p>

<ol class="list-decimal list-inside mb-4 space-y-2">
  <li>Baseline senaryosunun belirlenmesi</li>
  <li>Proje senaryosunun modellenmesi</li>
  <li>Karbon stok değişimlerinin ölçülmesi</li>
  <li>Leakage ve permanence risklerinin değerlendirilmesi</li>
</ol>

<blockquote class="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50 italic text-gray-700">
  <p>"Amazon yağmur ormanları her yıl 2.2 milyar ton CO2 absorbe ediyor. Bu, küresel emisyonların %6'sına denk geliyor."</p>
</blockquote>

<p class="mb-4">DECARBONIZE platformu, doğrulanmış orman koruma projelerine yatırım yaparak hem çevreyi koruma hem de finansal getiri elde etme imkanı sunmaktadır.</p>`,
      excerpt: 'Orman koruma projelerinin karbon kredisi potansiyeli ve DECARBONIZE platformu üzerinden yatırım fırsatları.',
      author: 'Dr. Zeynep Kaya',
      authorAvatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg',
      publishedAt: '2024-01-12T09:30:00Z',
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-12T09:30:00Z',
      category: 'Sürdürülebilirlik',
      tags: ['orman koruma', 'karbon kredisi', 'REDD+', 'çevre koruma'],
      coverImage: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
      status: 'published',
      language: 'tr',
      views: 543,
      likes: 38,
      readTime: 6,
      slug: 'orman-koruma-projelerinin-karbon-kredisi-potansiyeli',
      seoTitle: 'Orman Koruma Projeleri | Karbon Kredisi Potansiyeli',
      seoDescription: 'Orman koruma projelerinin karbon kredisi potansiyelini ve yatırım fırsatlarını keşfedin.'
    }
  ];

  const initialComments: BlogComment[] = [
    {
      id: '1',
      postId: '1',
      author: 'Ahmet Yılmaz',
      authorEmail: 'ahmet@example.com',
      content: 'Çok bilgilendirici bir yazı. Blockchain teknolojisinin karbon kredisi piyasasına getireceği yenilikleri merakla bekliyorum.',
      createdAt: '2024-01-20T12:00:00Z',
      likes: 5,
      isApproved: true
    },
    {
      id: '2',
      postId: '1',
      author: 'Elif Demir',
      authorEmail: 'elif@example.com',
      content: 'DECARBONIZE Token hakkında daha detaylı bilgi alabilir miyim? ICO sürecine katılmayı planlıyorum.',
      createdAt: '2024-01-20T14:30:00Z',
      likes: 3,
      isApproved: true
    },
    {
      id: '3',
      postId: '2',
      author: 'Can Özkan',
      authorEmail: 'can@example.com',
      content: 'ESG kriterlerinin önemini vurgulayan harika bir yazı. Sürdürülebilir yatırımlar geleceğin trendi.',
      createdAt: '2024-01-18T16:00:00Z',
      likes: 7,
      isApproved: true
    }
  ];

  return { posts: initialPosts, comments: initialComments, categories: initialCategories };
};

// Create store with localStorage integration
export const useBlogStore = create<BlogState>((set, get) => {
  // Initialize data from localStorage or use defaults
  const initializeData = () => {
    const storedPosts = localStorage.getItem('blog-posts');
    const storedComments = localStorage.getItem('blog-comments');
    const storedCategories = localStorage.getItem('blog-categories');
    
    if (!storedPosts || !storedComments || !storedCategories) {
      const { posts, comments, categories } = getInitialData();
      localStorage.setItem('blog-posts', JSON.stringify(posts));
      localStorage.setItem('blog-comments', JSON.stringify(comments));
      localStorage.setItem('blog-categories', JSON.stringify(categories));
      return { posts, comments, categories };
    }
    
    return {
      posts: JSON.parse(storedPosts),
      comments: JSON.parse(storedComments),
      categories: JSON.parse(storedCategories)
    };
  };

  const { posts: initialPosts, comments: initialComments, categories: initialCategories } = initializeData();
  
  const calculateStats = (posts: BlogPost[], comments: BlogComment[]): BlogStats => ({
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: comments.length,
    publishedPosts: posts.filter(post => post.status === 'published').length,
    draftPosts: posts.filter(post => post.status === 'draft').length
  });

  return {
    posts: initialPosts,
    comments: initialComments,
    categories: initialCategories,
    stats: calculateStats(initialPosts, initialComments),
    isLoading: false,

      fetchPosts: async (filters?: BlogFilters, page = 1, limit = 10) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        let { posts } = get();

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
        
        if (filters?.dateRange) {
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          filteredPosts = filteredPosts.filter(post => {
            const postDate = new Date(post.publishedAt);
            return postDate >= startDate && postDate <= endDate;
          });
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
        const post = posts.find(post => post.slug === slug);
        
        if (post && post.status === 'published') {
          // Increment views
          get().incrementViews(post.id);
        }
        
        return post || null;
      },

      createPost: async (postData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
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
        
        const { posts, comments } = get();
        const updatedPosts = [newPost, ...posts];
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
        
        // Update categories post count
        const { categories } = get();
        const updatedCategories = categories.map(cat => ({
          ...cat,
          postCount: updatedPosts.filter(p => p.category === cat.name && p.status === 'published').length
        }));
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({
          posts: updatedPosts,
          categories: updatedCategories,
          stats: calculateStats(updatedPosts, comments),
          isLoading: false
        });
        
        return newPost;
      },

      updatePost: async (id: string, updates: Partial<BlogPost>) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { posts, comments } = get();
        const updatedPosts = posts.map(post =>
          post.id === id
            ? {
                ...post,
                ...updates,
                updatedAt: new Date().toISOString(),
                slug: updates.title ? generateSlug(updates.title) : post.slug,
                readTime: updates.content ? calculateReadTime(updates.content) : post.readTime,
                excerpt: updates.content && !updates.excerpt ? extractExcerpt(updates.content) : (updates.excerpt || post.excerpt)
              }
            : post
        );
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
        
        // Update categories post count
        const { categories } = get();
        const updatedCategories = categories.map(cat => ({
          ...cat,
          postCount: updatedPosts.filter(p => p.category === cat.name && p.status === 'published').length
        }));
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({
          posts: updatedPosts,
          categories: updatedCategories,
          stats: calculateStats(updatedPosts, comments),
          isLoading: false
        });
      },

      deletePost: async (id: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { posts, comments } = get();
        const updatedPosts = posts.filter(post => post.id !== id);
        const updatedComments = comments.filter(comment => comment.postId !== id);
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
        localStorage.setItem('blog-comments', JSON.stringify(updatedComments));
        
        // Update categories post count
        const { categories } = get();
        const updatedCategories = categories.map(cat => ({
          ...cat,
          postCount: updatedPosts.filter(p => p.category === cat.name && p.status === 'published').length
        }));
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({
          posts: updatedPosts,
          comments: updatedComments,
          categories: updatedCategories,
          stats: calculateStats(updatedPosts, updatedComments),
          isLoading: false
        });
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
        const { posts, comments } = get();
        const updatedPosts = posts.map(post =>
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        );
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
        
        set({
          posts: updatedPosts,
          stats: calculateStats(updatedPosts, comments)
        });
      },

      incrementViews: async (id: string) => {
        const { posts, comments } = get();
        const updatedPosts = posts.map(post =>
          post.id === id ? { ...post, views: post.views + 1 } : post
        );
        
        // Save to localStorage
        localStorage.setItem('blog-posts', JSON.stringify(updatedPosts));
        
        set({
          posts: updatedPosts,
          stats: calculateStats(updatedPosts, comments)
        });
      },

      fetchComments: async (postId: string) => {
        const { comments } = get();
        return comments.filter(comment => comment.postId === postId);
      },

      addComment: async (commentData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newComment: BlogComment = {
          ...commentData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          likes: 0,
          isApproved: true // Auto-approve for demo
        };
        
        const { comments, posts } = get();
        const updatedComments = [...comments, newComment];
        
        // Save to localStorage
        localStorage.setItem('blog-comments', JSON.stringify(updatedComments));
        
        set({
          comments: updatedComments,
          stats: calculateStats(posts, updatedComments),
          isLoading: false
        });
      },

      likeComment: async (id: string) => {
        const { comments } = get();
        const updatedComments = comments.map(comment =>
          comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
        );
        
        // Save to localStorage
        localStorage.setItem('blog-comments', JSON.stringify(updatedComments));
        
        set({ comments: updatedComments });
      },

      deleteComment: async (id: string) => {
        const { comments, posts } = get();
        const updatedComments = comments.filter(comment => comment.id !== id);
        
        // Save to localStorage
        localStorage.setItem('blog-comments', JSON.stringify(updatedComments));
        
        set({
          comments: updatedComments,
          stats: calculateStats(posts, updatedComments)
        });
      },

      approveComment: async (id: string) => {
        const { comments } = get();
        const updatedComments = comments.map(comment =>
          comment.id === id ? { ...comment, isApproved: true } : comment
        );
        
        // Save to localStorage
        localStorage.setItem('blog-comments', JSON.stringify(updatedComments));
        
        set({ comments: updatedComments });
      },

      fetchCategories: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let { categories, posts } = get();

        // Update post counts
        const updatedCategories = categories.map(category => ({
          ...category,
          postCount: posts.filter(post => post.category === category.name && post.status === 'published').length
        }));
        
        set({ categories: updatedCategories, isLoading: false });
      },

      createCategory: async (categoryData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newCategory: BlogCategory = {
          ...categoryData,
          id: generateId(),
          postCount: 0
        };
        
        const { categories } = get();
        const updatedCategories = [...categories, newCategory];
        
        // Save to localStorage
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({
          categories: updatedCategories,
          isLoading: false
        });
      },

      updateCategory: async (id: string, updates: Partial<BlogCategory>) => {
        const { categories } = get();
        const updatedCategories = categories.map(category =>
          category.id === id ? { ...category, ...updates } : category
        );
        
        // Save to localStorage
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({ categories: updatedCategories });
      },

      deleteCategory: async (id: string) => {
        const { categories } = get();
        const updatedCategories = categories.filter(category => category.id !== id);
        
        // Save to localStorage
        localStorage.setItem('blog-categories', JSON.stringify(updatedCategories));
        
        set({ categories: updatedCategories });
      },

      fetchStats: async () => {
        const { posts, comments } = get();
        set({ stats: calculateStats(posts, comments) });
      },

      searchPosts: async (query: string) => {
        const { posts } = get();
        
        const searchResults = posts.filter(post => {
          const searchText = `${post.title} ${post.content} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
          return searchText.includes(query.toLowerCase()) && post.status === 'published';
        });
        
        return searchResults;
      }
  };
});