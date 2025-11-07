/**
 * Social Proof Component
 * Displays investor count, ratings, and recent activity
 */

import React from 'react';
import { Users, Star, TrendingUp } from 'lucide-react';

interface SocialProofProps {
  totalInvestors: number;
  averageRating: number;
  totalReviews: number;
  recentActivity?: string;
  showTrending?: boolean;
}

export default function SocialProof({
  totalInvestors,
  averageRating,
  totalReviews,
  recentActivity,
  showTrending = true,
}: SocialProofProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
      {/* Investors */}
      <div className="flex items-center space-x-1.5">
        <Users className="h-4 w-4" />
        <span className="font-medium text-gray-900">{totalInvestors.toLocaleString()}</span>
        <span>yatırımcı</span>
      </div>

      {/* Rating */}
      {totalReviews > 0 && (
        <div className="flex items-center space-x-1.5">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="font-medium text-gray-900">{averageRating.toFixed(1)}</span>
          <span>({totalReviews} değerlendirme)</span>
        </div>
      )}

      {/* Recent Activity / Trending */}
      {showTrending && (
        <div className="flex items-center space-x-1.5 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">
            {recentActivity || 'Son 24 saatte 15 yeni yatırımcı'}
          </span>
        </div>
      )}
    </div>
  );
}
