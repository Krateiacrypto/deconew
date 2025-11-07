import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementsPanel from './AchievementsPanel';
import Leaderboard from './Leaderboard';
import CountUp from 'react-countup';

type Tab = 'overview' | 'achievements' | 'leaderboard';

const GamificationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Mock user stats
  const userStats = {
    level: 12,
    currentXP: 3450,
    nextLevelXP: 5000,
    totalPoints: 8920,
    achievementsUnlocked: 15,
    totalAchievements: 30,
    leaderboardRank: 24,
    streak: 15, // days
  };

  const xpProgress = (userStats.currentXP / userStats.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎮 Oyunlaştırma
          </h1>
          <p className="text-lg text-gray-600">
            Başarımlar kazanın, puanlar toplayın, liderlerde yerinizi alın!
          </p>
        </div>

        {/* User Stats Card */}
        {activeTab === 'overview' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Level */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{userStats.level}</div>
                  <div className="text-sm opacity-90">Seviye</div>
                </div>

                {/* Points */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    <CountUp end={userStats.totalPoints} duration={2} separator="," />
                  </div>
                  <div className="text-sm opacity-90">Toplam Puan</div>
                </div>

                {/* Achievements */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {userStats.achievementsUnlocked}/{userStats.totalAchievements}
                  </div>
                  <div className="text-sm opacity-90">Başarımlar</div>
                </div>

                {/* Streak */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {userStats.streak} 🔥
                  </div>
                  <div className="text-sm opacity-90">Günlük Seri</div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>XP İlerlemesi</span>
                  <span>
                    {userStats.currentXP} / {userStats.nextLevelXP}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="bg-white h-3 rounded-full"
                  />
                </div>
                <p className="text-xs mt-2 opacity-75">
                  Bir sonraki seviyeye {userStats.nextLevelXP - userStats.currentXP} XP kaldı
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-2 mb-8 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Genel Bakış
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'achievements'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏅 Başarımlar
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏆 Liderlik Tablosu
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Liderlik Sırası</h3>
                <p className="text-3xl font-bold text-blue-600">#{userStats.leaderboardRank}</p>
                <p className="text-xs text-gray-500 mt-1">Tüm kullanıcılar arasında</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Bu Hafta Kazanılan XP</h3>
                <p className="text-3xl font-bold text-green-600">+1,240</p>
                <p className="text-xs text-gray-500 mt-1">Geçen haftadan %25 fazla</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Sonraki Başarım</h3>
                <p className="text-sm font-bold text-purple-600">Çeşitlendirme Ustası</p>
                <p className="text-xs text-gray-500 mt-1">%80 tamamlandı</p>
              </div>
            </div>

            {/* How to Earn Points */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Puan Nasıl Kazanılır?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="font-semibold text-gray-900">Yatırım Yap</p>
                    <p className="text-sm text-gray-600">Her 1,000₺ = 10 puan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Karbon Offset</p>
                    <p className="text-sm text-gray-600">1 ton CO₂ = 50 puan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Başarım Aç</p>
                    <p className="text-sm text-gray-600">100-2000 puan arası</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-semibold text-gray-900">Günlük Giriş</p>
                    <p className="text-sm text-gray-600">Her gün = 5 puan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && <AchievementsPanel />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
};

export default GamificationDashboard;
