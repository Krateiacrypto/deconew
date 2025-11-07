import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  value: number;
  change: number; // Position change from last week
  badge?: string;
}

type LeaderboardType = 'investors' | 'carbon' | 'points';
type TimeRange = 'weekly' | 'monthly' | 'alltime';

const Leaderboard: React.FC = () => {
  const [selectedType, setSelectedType] = useState<LeaderboardType>('investors');
  const [timeRange, setTimeRange] = useState<TimeRange>('alltime');

  // Mock data - In production, fetch from API
  const leaderboardData: Record<LeaderboardType, LeaderboardEntry[]> = {
    investors: [
      {
        rank: 1,
        userId: '1',
        username: 'GreenInvestor',
        value: 250000,
        change: 0,
        badge: '👑',
      },
      {
        rank: 2,
        userId: '2',
        username: 'EcoWarrior',
        value: 180000,
        change: 1,
        badge: '🥈',
      },
      {
        rank: 3,
        userId: '3',
        username: 'PlanetSaver',
        value: 125000,
        change: -1,
        badge: '🥉',
      },
      {
        rank: 4,
        userId: '4',
        username: 'CarbonNeutral',
        value: 98000,
        change: 2,
      },
      {
        rank: 5,
        userId: '5',
        username: 'TreeHugger',
        value: 85000,
        change: 0,
      },
      {
        rank: 6,
        userId: '6',
        username: 'ClimateHero',
        value: 72000,
        change: -2,
      },
      {
        rank: 7,
        userId: '7',
        username: 'GreenFuture',
        value: 65000,
        change: 1,
      },
      {
        rank: 8,
        userId: '8',
        username: 'EarthFirst',
        value: 58000,
        change: 0,
      },
      {
        rank: 9,
        userId: '9',
        username: 'Sustainability',
        value: 52000,
        change: 3,
      },
      {
        rank: 10,
        userId: '10',
        username: 'NatureDefender',
        value: 48000,
        change: -1,
      },
    ],
    carbon: [
      {
        rank: 1,
        userId: '3',
        username: 'PlanetSaver',
        value: 125.5,
        change: 0,
        badge: '👑',
      },
      {
        rank: 2,
        userId: '1',
        username: 'GreenInvestor',
        value: 98.2,
        change: 1,
        badge: '🥈',
      },
      {
        rank: 3,
        userId: '4',
        username: 'CarbonNeutral',
        value: 87.5,
        change: -1,
        badge: '🥉',
      },
      {
        rank: 4,
        userId: '2',
        username: 'EcoWarrior',
        value: 76.8,
        change: 0,
      },
      {
        rank: 5,
        userId: '6',
        username: 'ClimateHero',
        value: 65.3,
        change: 2,
      },
      {
        rank: 6,
        userId: '5',
        username: 'TreeHugger',
        value: 58.9,
        change: -1,
      },
      {
        rank: 7,
        userId: '7',
        username: 'GreenFuture',
        value: 52.4,
        change: 0,
      },
      {
        rank: 8,
        userId: '9',
        username: 'Sustainability',
        value: 45.7,
        change: 1,
      },
      {
        rank: 9,
        userId: '8',
        username: 'EarthFirst',
        value: 42.1,
        change: -2,
      },
      {
        rank: 10,
        userId: '10',
        username: 'NatureDefender',
        value: 38.6,
        change: 0,
      },
    ],
    points: [
      {
        rank: 1,
        userId: '1',
        username: 'GreenInvestor',
        value: 5420,
        change: 0,
        badge: '👑',
      },
      {
        rank: 2,
        userId: '3',
        username: 'PlanetSaver',
        value: 4890,
        change: 1,
        badge: '🥈',
      },
      {
        rank: 3,
        userId: '2',
        username: 'EcoWarrior',
        value: 4650,
        change: -1,
        badge: '🥉',
      },
      {
        rank: 4,
        userId: '4',
        username: 'CarbonNeutral',
        value: 3980,
        change: 0,
      },
      {
        rank: 5,
        userId: '6',
        username: 'ClimateHero',
        value: 3560,
        change: 2,
      },
      {
        rank: 6,
        userId: '5',
        username: 'TreeHugger',
        value: 3210,
        change: -1,
      },
      {
        rank: 7,
        userId: '7',
        username: 'GreenFuture',
        value: 2890,
        change: 0,
      },
      {
        rank: 8,
        userId: '9',
        username: 'Sustainability',
        value: 2540,
        change: 1,
      },
      {
        rank: 9,
        userId: '8',
        username: 'EarthFirst',
        value: 2310,
        change: -2,
      },
      {
        rank: 10,
        userId: '10',
        username: 'NatureDefender',
        value: 2080,
        change: 0,
      },
    ],
  };

  const currentData = leaderboardData[selectedType];

  const getValueLabel = (type: LeaderboardType, value: number) => {
    switch (type) {
      case 'investors':
        return `₺${value.toLocaleString('tr-TR')}`;
      case 'carbon':
        return `${value.toFixed(1)} ton CO₂`;
      case 'points':
        return `${value.toLocaleString('tr-TR')} puan`;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-green-600 text-sm">↑ {change}</span>;
    } else if (change < 0) {
      return <span className="text-red-600 text-sm">↓ {Math.abs(change)}</span>;
    }
    return <span className="text-gray-400 text-sm">-</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-2">🏆 Liderlik Tablosu</h2>
        <p className="text-blue-100">En iyi performans gösteren kullanıcılar</p>
      </div>

      {/* Type Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('investors')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'investors'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 Top Yatırımcılar
            </button>
            <button
              onClick={() => setSelectedType('carbon')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'carbon'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌍 Karbon Kahramanları
            </button>
            <button
              onClick={() => setSelectedType('points')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'points'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ En Çok Puan
            </button>
          </div>

          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Bu Hafta</option>
            <option value="monthly">Bu Ay</option>
            <option value="alltime">Tüm Zamanlar</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Sıra
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Kullanıcı
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Değer
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Değişim
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((entry, index) => (
                <motion.tr
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    entry.rank <= 3 ? 'bg-yellow-50/30' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-700">
                        {entry.rank}
                      </span>
                      {entry.badge && <span className="text-2xl">{entry.badge}</span>}
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {entry.username}
                      </span>
                    </div>
                  </td>

                  {/* Value */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900">
                      <CountUp
                        end={entry.value}
                        duration={1.5}
                        separator=","
                        decimals={selectedType === 'carbon' ? 1 : 0}
                        suffix={selectedType === 'carbon' ? ' ton' : ''}
                        prefix={selectedType === 'investors' ? '₺' : ''}
                      />
                      {selectedType === 'points' && ' pts'}
                    </span>
                  </td>

                  {/* Change */}
                  <td className="px-6 py-4 text-center">
                    {getChangeIndicator(entry.change)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Liderlik Tablosunda Nasıl Yükselirsiniz?
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Daha fazla yeşil projeye yatırım yapın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Karbon offset miktarınızı artırın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Başarımları tamamlayarak puan kazanın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Her hafta güncellenir - aktif kalın!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
