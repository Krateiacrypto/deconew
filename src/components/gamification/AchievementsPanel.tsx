import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard';
import type { Achievement } from './AchievementCard';

const AchievementsPanel: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock achievements - In production, fetch from API
  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-investment',
      title: 'İlk Adım',
      description: 'İlk yatırımınızı yapın',
      icon: '🌱',
      category: 'investment',
      requirement: '1 yatırım yap',
      points: 100,
      unlocked: true,
      unlockedAt: '2024-11-01',
      progress: 100,
      rarity: 'common',
    },
    {
      id: 'investor-10k',
      title: 'Ciddi Yatırımcı',
      description: '10,000₺ toplam yatırım yapın',
      icon: '💰',
      category: 'investment',
      requirement: '10,000₺ toplam yatırım',
      points: 500,
      unlocked: true,
      unlockedAt: '2024-11-05',
      progress: 100,
      rarity: 'rare',
    },
    {
      id: 'investor-100k',
      title: 'Büyük Yatırımcı',
      description: '100,000₺ toplam yatırım yapın',
      icon: '🏆',
      category: 'investment',
      requirement: '100,000₺ toplam yatırım',
      points: 2000,
      unlocked: false,
      progress: 45,
      rarity: 'epic',
    },
    {
      id: 'carbon-saver-1ton',
      title: 'Karbon Savaşçısı',
      description: '1 ton CO₂ offset edin',
      icon: '🌍',
      category: 'carbon',
      requirement: '1 ton CO₂ offset',
      points: 300,
      unlocked: true,
      unlockedAt: '2024-11-03',
      progress: 100,
      rarity: 'rare',
    },
    {
      id: 'carbon-saver-10ton',
      title: 'Karbon Kahramanı',
      description: '10 ton CO₂ offset edin',
      icon: '🦸',
      category: 'carbon',
      requirement: '10 ton CO₂ offset',
      points: 1500,
      unlocked: false,
      progress: 67,
      rarity: 'epic',
    },
    {
      id: 'project-diversity',
      title: 'Çeşitlendirme Ustası',
      description: '5 farklı projeye yatırım yapın',
      icon: '🎯',
      category: 'investment',
      requirement: '5 farklı proje',
      points: 400,
      unlocked: false,
      progress: 80,
      rarity: 'rare',
    },
    {
      id: 'social-sharer',
      title: 'Elçi',
      description: 'Başarımlarınızı 3 kez paylaşın',
      icon: '📢',
      category: 'social',
      requirement: '3 sosyal paylaşım',
      points: 200,
      unlocked: false,
      progress: 33,
      rarity: 'common',
    },
    {
      id: 'early-adopter',
      title: 'Öncü',
      description: 'Platformun ilk 100 kullanıcısı olun',
      icon: '⭐',
      category: 'milestone',
      requirement: 'İlk 100 kullanıcı',
      points: 1000,
      unlocked: true,
      unlockedAt: '2024-10-15',
      progress: 100,
      rarity: 'legendary',
    },
    {
      id: 'monthly-active',
      title: 'Sadık Kullanıcı',
      description: '30 gün üst üste giriş yapın',
      icon: '🔥',
      category: 'milestone',
      requirement: '30 günlük streak',
      points: 600,
      unlocked: false,
      progress: 23,
      rarity: 'rare',
    },
  ]);

  const filteredAchievements = achievements.filter((achievement) => {
    const statusMatch =
      filter === 'all' ||
      (filter === 'unlocked' && achievement.unlocked) ||
      (filter === 'locked' && !achievement.unlocked);

    const categoryMatch =
      categoryFilter === 'all' || achievement.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleClaimAchievement = (id: string) => {
    console.log('Claiming achievement:', id);
    // TODO: API call to claim achievement
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{unlockedCount}</p>
            <p className="text-sm opacity-90">Kazanılan</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{achievements.length}</p>
            <p className="text-sm opacity-90">Toplam</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{totalPoints}</p>
            <p className="text-sm opacity-90">Puan</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'unlocked'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kazanılan
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'locked'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kilitli
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="investment">Yatırım</option>
            <option value="carbon">Karbon</option>
            <option value="social">Sosyal</option>
            <option value="milestone">Kilometre Taşı</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementCard
              achievement={achievement}
              onClaim={handleClaimAchievement}
            />
          </motion.div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu filtrede başarım bulunamadı</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
