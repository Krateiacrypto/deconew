import React, { useState, useEffect } from 'react';
import PortfolioOverview from './PortfolioOverview';
import InvestmentPerformanceChart from './InvestmentPerformanceChart';
import AssetAllocationChart from './AssetAllocationChart';
import InvestmentsList from './InvestmentsList';
import type { PerformanceDataPoint } from './InvestmentPerformanceChart';
import type { AllocationData } from './AssetAllocationChart';
import type { Investment } from './InvestmentsList';

const PortfolioDashboard: React.FC = React.memo(() => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Replace with API call in the future
  const [portfolioStats] = useState({
    totalInvested: 125000,
    currentValue: 142500,
    totalReturns: 17500,
    roi: 14.0,
    activeProjects: 8,
    pendingReturns: 8200,
  });

  const [performanceData] = useState<PerformanceDataPoint[]>([
    { date: 'Oca', invested: 25000, currentValue: 26500, returns: 1500 },
    { date: 'Şub', invested: 45000, currentValue: 48200, returns: 3200 },
    { date: 'Mar', invested: 65000, currentValue: 70500, returns: 5500 },
    { date: 'Nis', invested: 85000, currentValue: 92800, returns: 7800 },
    { date: 'May', invested: 100000, currentValue: 112000, returns: 12000 },
    { date: 'Haz', invested: 115000, currentValue: 130500, returns: 15500 },
    { date: 'Tem', invested: 125000, currentValue: 142500, returns: 17500 },
  ]);

  const [allocationData] = useState<AllocationData[]>([
    {
      projectName: 'Amazon Ağaçlandırma',
      amount: 35000,
      percentage: 28.0,
      color: 'rgb(34, 197, 94)',
    },
    {
      projectName: 'Güneş Enerjisi Tesisi',
      amount: 28000,
      percentage: 22.4,
      color: 'rgb(59, 130, 246)',
    },
    {
      projectName: 'Okyanus Temizleme',
      amount: 22000,
      percentage: 17.6,
      color: 'rgb(168, 85, 247)',
    },
    {
      projectName: 'Rüzgar Türbini Projesi',
      amount: 18000,
      percentage: 14.4,
      color: 'rgb(251, 146, 60)',
    },
    {
      projectName: 'Organik Tarım',
      amount: 12000,
      percentage: 9.6,
      color: 'rgb(236, 72, 153)',
    },
    {
      projectName: 'Su Arıtma Tesisi',
      amount: 10000,
      percentage: 8.0,
      color: 'rgb(14, 165, 233)',
    },
  ]);

  const [investments] = useState<Investment[]>([
    {
      id: 1,
      projectName: 'Amazon Ağaçlandırma',
      projectId: 101,
      amount: 35000,
      currentValue: 40250,
      returns: 5250,
      roi: 15.0,
      status: 'active',
      investmentDate: '2024-01-15',
      tokens: 350,
      carbonCredits: 87.5,
    },
    {
      id: 2,
      projectName: 'Güneş Enerjisi Tesisi',
      projectId: 102,
      amount: 28000,
      currentValue: 31920,
      returns: 3920,
      roi: 14.0,
      status: 'active',
      investmentDate: '2024-02-20',
      tokens: 280,
      carbonCredits: 70.0,
    },
    {
      id: 3,
      projectName: 'Okyanus Temizleme',
      projectId: 103,
      amount: 22000,
      currentValue: 25300,
      returns: 3300,
      roi: 15.0,
      status: 'active',
      investmentDate: '2024-03-10',
      tokens: 220,
      carbonCredits: 55.0,
    },
    {
      id: 4,
      projectName: 'Rüzgar Türbini Projesi',
      projectId: 104,
      amount: 18000,
      currentValue: 20340,
      returns: 2340,
      roi: 13.0,
      status: 'active',
      investmentDate: '2024-04-05',
      tokens: 180,
      carbonCredits: 45.0,
    },
    {
      id: 5,
      projectName: 'Organik Tarım',
      projectId: 105,
      amount: 12000,
      currentValue: 13200,
      returns: 1200,
      roi: 10.0,
      status: 'confirmed',
      investmentDate: '2024-05-12',
      tokens: 120,
      carbonCredits: 30.0,
    },
    {
      id: 6,
      projectName: 'Su Arıtma Tesisi',
      projectId: 106,
      amount: 10000,
      currentValue: 11500,
      returns: 1500,
      roi: 15.0,
      status: 'active',
      investmentDate: '2024-06-01',
      tokens: 100,
      carbonCredits: 25.0,
    },
  ]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (investment: Investment) => {
    console.log('View details for investment:', investment);
    // TODO: Navigate to investment detail page or open modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💼 Yatırım Portföyüm
          </h1>
          <p className="text-gray-600">
            Yatırımlarınızın performansını takip edin ve karbon etkisini görün
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="mb-8">
          <PortfolioOverview stats={portfolioStats} isLoading={isLoading} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <div>
            {isLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[500px] animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-full bg-gray-200 rounded"></div>
              </div>
            ) : (
              <InvestmentPerformanceChart data={performanceData} />
            )}
          </div>

          {/* Allocation Chart */}
          <div>
            {isLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-[500px] animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-full bg-gray-200 rounded"></div>
              </div>
            ) : (
              <AssetAllocationChart data={allocationData} />
            )}
          </div>
        </div>

        {/* Investments List */}
        <div className="mb-8">
          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-64 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <InvestmentsList
              investments={investments}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        {/* Carbon Impact Summary */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">🌍 Karbon Etkisi</h3>
              <p className="text-green-100 text-sm">
                Yatırımlarınız sayesinde çevreye olan olumlu katkınız
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">
                {investments.reduce((sum, inv) => sum + inv.carbonCredits, 0).toFixed(1)}
              </p>
              <p className="text-green-100 text-sm mt-1">ton CO₂ azaltım</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-400">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {Math.round(investments.reduce((sum, inv) => sum + inv.carbonCredits, 0) * 50)}
              </p>
              <p className="text-green-100 text-xs mt-1">Eşdeğer Ağaç</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{investments.length}</p>
              <p className="text-green-100 text-xs mt-1">Yeşil Proje</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {investments.reduce((sum, inv) => sum + inv.tokens, 0).toFixed(0)}
              </p>
              <p className="text-green-100 text-xs mt-1">DCB Token</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PortfolioDashboard;
