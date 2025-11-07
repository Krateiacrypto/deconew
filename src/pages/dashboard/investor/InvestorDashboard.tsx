import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Award,
  Briefcase,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
} from 'lucide-react';
import { getInvestorTierLimits, canUpgradeTier } from '../../../utils/permissionHelpers';

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  carbonCredits: number;
  change24h: number;
  stakingRewards: number;
}

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvested: 0,
    totalReturns: 0,
    carbonCredits: 0,
    change24h: 0,
    stakingRewards: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from Supabase
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalValue: 12500.00,
        totalInvested: 10000.00,
        totalReturns: 2500.00,
        carbonCredits: 125.5,
        change24h: 5.2,
        stakingRewards: 458.30,
      });
      setLoading(false);
    }, 500);
  }, []);

  const tierLimits = user?.investorTier ? getInvestorTierLimits(user.investorTier) : null;
  const upgradeStatus = user?.investorTier
    ? canUpgradeTier(user.investorTier, stats.totalInvested, 5000)
    : { canUpgrade: false };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your portfolio today
        </p>
      </div>

      {/* Tier Upgrade Alert */}
      {upgradeStatus.canUpgrade && (
        <div className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                🎉 Congratulations! You're eligible for an upgrade
              </h3>
              <p className="text-emerald-50">
                Upgrade to {upgradeStatus.targetTier?.toUpperCase()} tier and unlock premium features
              </p>
            </div>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Portfolio Value */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm font-medium ${
                stats.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.change24h >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(stats.change24h)}%</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Portfolio</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${stats.totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            +${(stats.totalValue - stats.totalInvested).toLocaleString()} profit
          </p>
        </div>

        {/* Carbon Credits */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Carbon Credits</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.carbonCredits}</p>
          <p className="text-sm text-gray-500 mt-2">tons CO₂ offset</p>
        </div>

        {/* Staking Rewards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Staking Rewards</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${stats.stakingRewards.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {tierLimits?.stakingMultiplier}x multiplier
          </p>
        </div>

        {/* ROI */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total ROI</h3>
          <p className="text-3xl font-bold text-gray-900">
            {((stats.totalReturns / stats.totalInvested) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Since inception</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Allocation - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Portfolio Allocation</h2>
            <Link
              to="/portfolio"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View Details →
            </Link>
          </div>

          {/* Allocation Chart Placeholder */}
          <div className="space-y-4">
            {[
              { name: 'Renewable Energy', value: 40, color: 'bg-green-500' },
              { name: 'Reforestation', value: 30, color: 'bg-emerald-500' },
              { name: 'Carbon Capture', value: 20, color: 'bg-blue-500' },
              { name: 'Other', value: 10, color: 'bg-gray-400' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trading Fee</span>
              <span className="font-semibold text-gray-900">
                {tierLimits?.tradingFee ? `${(tierLimits.tradingFee * 100).toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            {tierLimits?.monthlyLimit && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Monthly Limit</span>
                <span className="font-semibold text-gray-900">
                  ${tierLimits.monthlyLimit.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - 1 column */}
        <div className="space-y-6">
          {/* Quick Trade */}
          <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <Target className="w-10 h-10 mb-4" />
            <h3 className="text-lg font-bold mb-2">Quick Trade</h3>
            <p className="text-emerald-50 text-sm mb-4">
              Buy or sell carbon credits instantly
            </p>
            <Link
              to="/trading"
              className="block w-full bg-white text-emerald-600 text-center py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Start Trading
            </Link>
          </div>

          {/* Browse Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Briefcase className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Browse Projects</h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover verified carbon offset projects
            </p>
            <Link
              to="/projects"
              className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Explore Projects
            </Link>
          </div>

          {/* Staking */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Zap className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Earn Rewards</h3>
            <p className="text-gray-600 text-sm mb-4">
              Stake your tokens and earn {tierLimits?.stakingMultiplier}x rewards
            </p>
            <Link
              to="/staking"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Staking
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              type: 'investment',
              project: 'Solar Farm Portugal',
              amount: 500,
              credits: 5.2,
              date: '2 hours ago',
            },
            {
              type: 'reward',
              project: 'Staking Rewards',
              amount: 125.50,
              credits: 0,
              date: '1 day ago',
            },
            {
              type: 'trade',
              project: 'Carbon Credit Trade',
              amount: -200,
              credits: -2.1,
              date: '2 days ago',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === 'investment'
                      ? 'bg-green-100'
                      : activity.type === 'reward'
                      ? 'bg-blue-100'
                      : 'bg-orange-100'
                  }`}
                >
                  {activity.type === 'investment' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  ) : activity.type === 'reward' ? (
                    <Award className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.project}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    activity.amount > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
                </p>
                {activity.credits !== 0 && (
                  <p className="text-sm text-gray-500">
                    {activity.credits > 0 ? '+' : ''}
                    {activity.credits} CO₂
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
