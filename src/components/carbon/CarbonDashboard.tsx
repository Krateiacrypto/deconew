/**
 * Carbon Dashboard Component
 * Main dashboard for carbon impact visualization
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Filter } from 'lucide-react';
import LiveCarbonCounter from './LiveCarbonCounter';
import ImpactMetricCard from './ImpactMetricCard';
import CarbonImpactChart from './CarbonImpactChart';

export default function CarbonDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - In production, fetch from API
  const [dashboardData, setDashboardData] = useState({
    totalCO2Reduced: 15234.67,
    energySaved: 89456.2, // MWh
    waterSaved: 234567, // Liters
    biodiversityScore: 87.5, // 0-100
    incrementRate: 0.127, // CO2 per minute
  });

  // Historical data for chart
  const chartData = {
    labels: [
      'Oca',
      'Şub',
      'Mar',
      'Nis',
      'May',
      'Haz',
      'Tem',
      'Ağu',
      'Eyl',
      'Eki',
      'Kas',
      'Ara',
    ],
    actual: [850, 1200, 1450, 1890, 2340, 2780, 3120, 3580, 4120, 4680, 5240, 5890],
    projected: [
      850, 1200, 1450, 1890, 2340, 2780, 3120, 3580, 4120, 4680, 5240, 5890, 6540, 7290,
      8140, 9090,
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Karbon verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="mr-3 text-green-600" />
                Karbon Etkisi Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Platform genelinde karbon azaltım verilerinizi takip edin
              </p>
            </div>

            {/* Time Range Selector */}
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="1y">Son 1 Yıl</option>
                <option value="all">Tüm Zamanlar</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Live Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LiveCarbonCounter
              totalCO2={dashboardData.totalCO2Reduced}
              incrementRate={dashboardData.incrementRate}
              isLive={true}
            />
          </motion.div>

          {/* Impact Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detaylı Etki Metrikleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ImpactMetricCard
                icon="⚡"
                title="Enerji Tasarrufu"
                value={dashboardData.energySaved}
                unit="MWh"
                trend={12.5}
                color="orange"
                description="Yenilenebilir enerji üretimi"
              />

              <ImpactMetricCard
                icon="💧"
                title="Su Tasarrufu"
                value={dashboardData.waterSaved}
                unit="L"
                trend={8.3}
                color="blue"
                description="Korunan su kaynakları"
              />

              <ImpactMetricCard
                icon="🦋"
                title="Biyoçeşitlilik Skoru"
                value={dashboardData.biodiversityScore}
                unit="/100"
                trend={5.2}
                color="purple"
                description="Ekosistem sağlığı göstergesi"
              />

              <ImpactMetricCard
                icon="🌍"
                title="Aktif Projeler"
                value={42}
                unit="proje"
                trend={15.8}
                color="green"
                description="Karbon azaltma projeleri"
              />
            </div>
          </motion.div>

          {/* Carbon Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CarbonImpactChart
              data={chartData}
              title="Yıllık Karbon Azaltma Trendi (Son 12 Ay)"
            />
          </motion.div>

          {/* Additional Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Methodology */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                <Filter className="mr-2" />
                Hesaplama Metodolojisi
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Standart:</strong> Gold Standard VCS + IPCC 2023
                </p>
                <p>
                  <strong>Doğrulama:</strong> Üçüncü parti denetim (Bureau Veritas)
                </p>
                <p>
                  <strong>Güncelleme:</strong> Her 24 saatte bir
                </p>
                <p>
                  <strong>Kesinlik:</strong> ±3% hata payı
                </p>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-3">
                En Yüksek Etki Yaratan Projeler
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Amazon Rainforest Protection', co2: '5,234 ton' },
                  { name: 'Solar Energy Turkey', co2: '3,890 ton' },
                  { name: 'Wind Farm Mediterranean', co2: '2,567 ton' },
                ].map((project, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {idx + 1}. {project.name}
                    </span>
                    <span className="text-sm font-bold text-green-700">
                      {project.co2}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
