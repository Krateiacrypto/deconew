/**
 * Impact Metric Card Component
 * Displays a single impact metric with icon and trend
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

interface ImpactMetricCardProps {
  icon: string;
  title: string;
  value: number;
  unit: string;
  trend?: number; // Percentage change
  color?: 'green' | 'blue' | 'purple' | 'orange';
  description?: string;
}

export default function ImpactMetricCard({
  icon,
  title,
  value,
  unit,
  trend,
  color = 'green',
  description,
}: ImpactMetricCardProps) {
  const colorClasses = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
      trend: 'text-green-600',
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      trend: 'text-blue-600',
    },
    purple: {
      bg: 'from-purple-50 to-pink-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      trend: 'text-purple-600',
    },
    orange: {
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      trend: 'text-orange-600',
    },
  };

  const colors = colorClasses[color];
  const isTrendPositive = trend !== undefined && trend > 0;

  return (
    <motion.div
      className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 ${colors.border} shadow-sm`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className="text-5xl">{icon}</div>

        {/* Trend Badge */}
        {trend !== undefined && (
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isTrendPositive ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {isTrendPositive ? (
              <TrendingUp className={`w-3 h-3 ${colors.trend}`} />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span
              className={`text-xs font-semibold ${
                isTrendPositive ? colors.trend : 'text-red-600'
              }`}
            >
              {trend > 0 ? '+' : ''}
              {trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      {/* Value */}
      <div className={`text-3xl font-bold ${colors.text} mb-1`}>
        <CountUp end={value} duration={2} separator="," decimals={value < 10 ? 2 : 0} />
        <span className="text-lg ml-2">{unit}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </motion.div>
  );
}
