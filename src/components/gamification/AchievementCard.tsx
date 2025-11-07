import React from 'react';
import { motion } from 'framer-motion';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'investment' | 'carbon' | 'social' | 'milestone';
  requirement: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-100
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCardProps {
  achievement: Achievement;
  onClaim?: (id: string) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClaim }) => {
  const rarityColors = {
    common: {
      border: 'border-gray-300',
      bg: 'from-gray-50 to-gray-100',
      badge: 'bg-gray-200 text-gray-700',
      glow: '',
    },
    rare: {
      border: 'border-blue-400',
      bg: 'from-blue-50 to-cyan-50',
      badge: 'bg-blue-200 text-blue-700',
      glow: 'shadow-blue-200',
    },
    epic: {
      border: 'border-purple-400',
      bg: 'from-purple-50 to-pink-50',
      badge: 'bg-purple-200 text-purple-700',
      glow: 'shadow-purple-200',
    },
    legendary: {
      border: 'border-yellow-400',
      bg: 'from-yellow-50 to-orange-50',
      badge: 'bg-yellow-200 text-yellow-700',
      glow: 'shadow-yellow-200',
    },
  };

  const colors = rarityColors[achievement.rarity];
  const isClaimable = achievement.progress === 100 && !achievement.unlocked;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
      className={`relative rounded-xl border-2 p-6 transition-all ${colors.border} ${
        achievement.unlocked ? `bg-gradient-to-br ${colors.bg} ${colors.glow} shadow-lg` : 'bg-gray-100 opacity-60'
      }`}
    >
      {/* Locked overlay */}
      {!achievement.unlocked && achievement.progress < 100 && (
        <div className="absolute inset-0 bg-gray-900/10 rounded-xl backdrop-blur-[1px] flex items-center justify-center">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      {/* Rarity badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
          {achievement.rarity.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">+{achievement.points} pts</span>
      </div>

      {/* Icon */}
      <div className="text-center mb-4">
        <span className="text-5xl">{achievement.icon}</span>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
        {achievement.title}
      </h3>
      <p className="text-sm text-gray-600 text-center mb-4">
        {achievement.description}
      </p>

      {/* Requirement */}
      <div className="bg-white/50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-700 text-center">
          <strong>Gereksinim:</strong> {achievement.requirement}
        </p>
      </div>

      {/* Progress bar */}
      {!achievement.unlocked && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>İlerleme</span>
            <span>{achievement.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Unlocked date */}
      {achievement.unlocked && achievement.unlockedAt && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            ✅ Kazanıldı: {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
      )}

      {/* Claim button */}
      {isClaimable && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onClaim?.(achievement.id)}
          className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          🎉 Ödülü Al
        </motion.button>
      )}
    </motion.div>
  );
};

export default AchievementCard;
