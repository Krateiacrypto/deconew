/**
 * Project Badges Component
 * Displays trust badges (verified, trending, high_impact, etc.)
 */

import React from 'react';
import { Shield, TrendingUp, Leaf, Lock, Zap, Award } from 'lucide-react';

type Badge = 'verified' | 'trending' | 'high_impact' | 'low_risk' | 'quick_returns' | 'featured';

interface ProjectBadgesProps {
  badges: Badge[];
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig: Record<
  Badge,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  verified: {
    label: 'Doğrulanmış',
    icon: Shield,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  trending: {
    label: 'Trend',
    icon: TrendingUp,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  high_impact: {
    label: 'Yüksek Etki',
    icon: Leaf,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  low_risk: {
    label: 'Düşük Risk',
    icon: Lock,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  quick_returns: {
    label: 'Hızlı Getiri',
    icon: Zap,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  featured: {
    label: 'Öne Çıkan',
    icon: Award,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
};

export default function ProjectBadges({ badges, size = 'md' }: ProjectBadgesProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badgeType) => {
        const config = badgeConfig[badgeType];
        const Icon = config.icon;

        return (
          <span
            key={badgeType}
            className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${config.color} ${config.bgColor} ${config.borderColor} ${sizeClasses[size]}`}
          >
            <Icon className={iconSizes[size]} />
            <span>{config.label}</span>
          </span>
        );
      })}
    </div>
  );
}
