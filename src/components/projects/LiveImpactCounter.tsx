/**
 * Live Impact Counter Component
 * Real-time animated counters for CO2 reduction, investors, funding
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, DollarSign, Zap } from 'lucide-react';
import { EnhancedProject } from '../../types/project-enhanced';

interface LiveImpactCounterProps {
  project: EnhancedProject;
}

interface CounterStat {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  increment: number; // Per second
}

export default function LiveImpactCounter({ project }: LiveImpactCounterProps) {
  const [stats, setStats] = useState<CounterStat[]>([
    {
      label: 'CO₂ Azaltımı',
      value: project.carbonImpact?.totalCO2Reduction || 0,
      unit: 'ton/yıl',
      icon: Leaf,
      color: 'text-green-600',
      increment: 0.001, // Simulated real-time increment
    },
    {
      label: 'Aktif Yatırımcı',
      value: project.investorCount || 0,
      unit: '',
      icon: Users,
      color: 'text-blue-600',
      increment: 0,
    },
    {
      label: 'Toplam Fonlama',
      value: project.currentFunding || 0,
      unit: '$',
      icon: DollarSign,
      color: 'text-purple-600',
      increment: project.fundingVelocity ? project.fundingVelocity / 86400 : 0, // Per second
    },
    {
      label: 'Enerji Üretimi',
      value: project.carbonImpact?.energyGenerated || 0,
      unit: 'MWh',
      icon: Zap,
      color: 'text-yellow-600',
      increment: 0.0001,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value: stat.value + stat.increment,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(value < 10 ? 2 : 0);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Canlı Etki Sayacı
          </h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">Canlı</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                    <div className={`text-xl font-bold ${stat.color}`}>
                      {formatNumber(stat.value, stat.unit)}
                      {stat.unit && stat.unit !== '$' && (
                        <span className="text-sm font-normal text-gray-600 ml-1">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Equivalents */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">
              {(project.carbonImpact?.equivalentTrees || 0).toLocaleString()}
            </span>{' '}
            ağaç dikimi eşdeğeri
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {(project.carbonImpact?.equivalentCars || 0).toLocaleString()}
            </span>{' '}
            araç trafikten çıkarılması eşdeğeri
          </div>
          {project.carbonImpact?.waterSaved && (
            <div>
              <span className="font-medium text-gray-900">
                {(project.carbonImpact.waterSaved / 1000000).toFixed(1)}M
              </span>{' '}
              litre su tasarrufu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
