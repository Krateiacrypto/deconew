/**
 * Live Carbon Counter Component
 * Displays real-time carbon reduction with animated counter
 */

import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf } from 'lucide-react';

interface LiveCarbonCounterProps {
  totalCO2: number;
  incrementRate?: number; // CO2 per minute
  isLive?: boolean;
}

export default function LiveCarbonCounter({
  totalCO2,
  incrementRate = 0.05,
  isLive = true,
}: LiveCarbonCounterProps) {
  const [currentValue, setCurrentValue] = useState(totalCO2);

  // Simulate real-time increment
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCurrentValue((prev) => prev + incrementRate / 60); // Per second
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementRate, isLive]);

  const equivalentTrees = Math.round(currentValue * 50);
  const equivalentCars = Math.round(currentValue / 4.6);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
      {/* Live Indicator */}
      {isLive && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-600">
            Canlı Güncelleniyor
          </span>
        </div>
      )}

      {/* Main Counter */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-700">
              Toplam Karbon Azaltımı
            </h2>
          </div>

          <div className="text-6xl font-bold text-green-700 mb-2">
            <CountUp
              start={totalCO2}
              end={currentValue}
              duration={2}
              decimals={2}
              separator=","
            />
          </div>

          <p className="text-2xl text-gray-600">ton CO₂</p>
        </motion.div>
      </div>

      {/* Equivalents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trees Equivalent */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Eşdeğer Ağaç</p>
              <p className="text-3xl font-bold text-green-700">
                <CountUp end={equivalentTrees} duration={2} separator="," />
              </p>
            </div>
            <div className="text-5xl">🌳</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Bir ağaç yılda ~20kg CO₂ emer
          </p>
        </motion.div>

        {/* Cars Equivalent */}
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Arabalar Yoldan</p>
              <p className="text-3xl font-bold text-blue-700">
                <CountUp end={equivalentCars} duration={2} separator="," />
              </p>
            </div>
            <div className="text-5xl">🚗</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Ortalama araba yılda 4.6 ton CO₂ üretir
          </p>
        </motion.div>
      </div>

      {/* Velocity Indicator */}
      {isLive && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>
            <span className="font-semibold text-green-700">
              {incrementRate.toFixed(3)} ton CO₂/dakika
            </span>{' '}
            azaltma hızı
          </span>
        </div>
      )}
    </div>
  );
}
