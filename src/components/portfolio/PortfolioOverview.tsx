import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface PortfolioStats {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  roi: number;
  activeProjects: number;
  pendingReturns: number;
}

interface PortfolioOverviewProps {
  stats: PortfolioStats;
  isLoading?: boolean;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ stats, isLoading }) => {
  const profitLoss = stats.currentValue - stats.totalInvested;
  const isProfitable = profitLoss >= 0;

  const metricCards = [
    {
      title: 'Toplam Yatırım',
      value: stats.totalInvested,
      prefix: '₺',
      icon: '💰',
      color: 'blue' as const,
      description: 'Toplam yatırdığınız tutar',
    },
    {
      title: 'Mevcut Değer',
      value: stats.currentValue,
      prefix: '₺',
      icon: '📈',
      color: 'green' as const,
      description: 'Yatırımlarınızın güncel değeri',
    },
    {
      title: 'Kar/Zarar',
      value: Math.abs(profitLoss),
      prefix: isProfitable ? '+₺' : '-₺',
      icon: isProfitable ? '✅' : '📉',
      color: isProfitable ? 'green' as const : 'orange' as const,
      description: 'Net kar veya zarar',
      trend: stats.roi,
    },
    {
      title: 'ROI',
      value: stats.roi,
      suffix: '%',
      icon: '📊',
      color: stats.roi >= 0 ? 'green' as const : 'orange' as const,
      description: 'Yatırım getirisi oranı',
    },
    {
      title: 'Aktif Projeler',
      value: stats.activeProjects,
      icon: '🌱',
      color: 'purple' as const,
      description: 'Yatırım yaptığınız proje sayısı',
    },
    {
      title: 'Bekleyen Getiri',
      value: stats.pendingReturns,
      prefix: '₺',
      icon: '⏳',
      color: 'blue' as const,
      description: 'Beklenen toplam getiri',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-br ${getColorClasses(card.color).bg} rounded-xl p-6 border ${getColorClasses(card.color).border} shadow-sm hover:shadow-md transition-all`}
        >
          {/* Icon and Title */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{card.icon}</span>
              <h3 className={`text-sm font-medium ${getColorClasses(card.color).text}`}>
                {card.title}
              </h3>
            </div>
            {card.trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  card.trend >= 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {card.trend >= 0 ? '↑' : '↓'} {Math.abs(card.trend).toFixed(2)}%
              </div>
            )}
          </div>

          {/* Value */}
          <div className={`text-3xl font-bold mb-2 ${getColorClasses(card.color).value}`}>
            {card.prefix}
            <CountUp
              end={card.value}
              duration={2}
              separator=","
              decimals={card.suffix === '%' ? 2 : 0}
            />
            {card.suffix}
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600">{card.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

const getColorClasses = (color: 'green' | 'blue' | 'purple' | 'orange') => {
  const classes = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
      value: 'text-green-600',
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      value: 'text-blue-600',
    },
    purple: {
      bg: 'from-purple-50 to-fuchsia-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      value: 'text-purple-600',
    },
    orange: {
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      value: 'text-orange-600',
    },
  };
  return classes[color];
};

export default PortfolioOverview;
