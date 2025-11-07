import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Award, CheckCircle } from 'lucide-react';
import { tierService } from '../../services/tierService';
import { InvestorTier } from '../../types';
import toast from 'react-hot-toast';

interface Props {
  userId: string;
  currentTier: InvestorTier;
  onUpgrade?: () => void;
}

export default function TierUpgradeCard({ userId, currentTier, onUpgrade }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [upgradeInfo, setUpgradeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadStats();
  }, [userId]);

  async function loadStats() {
    try {
      setLoading(true);
      const stats = await tierService.getUserInvestmentStats(userId);
      setStats(stats);

      const nextTier = currentTier === 'free' ? 'pro' : 'institutional';
      if (currentTier !== 'institutional') {
        const info = await tierService.canUpgradeToTier(userId, nextTier);
        setUpgradeInfo(info);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkUpgrade() {
    try {
      setChecking(true);
      const result = await tierService.checkAndUpgradeTier(userId);

      if (result.upgraded) {
        toast.success(`Congratulations! Upgraded to ${result.current_tier.toUpperCase()} tier`);
        onUpgrade?.();
      } else {
        toast.info('No upgrade available yet. Keep investing!');
      }
    } catch (error) {
      toast.error('Failed to check upgrade');
    } finally {
      setChecking(false);
    }
  }

  if (loading || !stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    const colors = {
      free: 'from-gray-400 to-gray-600',
      pro: 'from-blue-400 to-blue-600',
      institutional: 'from-purple-400 to-purple-600'
    };
    return colors[tier as keyof typeof colors] || colors.free;
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'institutional') return Award;
    if (tier === 'pro') return Star;
    return CheckCircle;
  };

  const CurrentTierIcon = getTierIcon(currentTier);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Current Tier Badge */}
      <div className={`bg-gradient-to-r ${getTierColor(currentTier)} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Current Tier</p>
            <h3 className="text-2xl font-bold flex items-center gap-2 mt-1">
              <CurrentTierIcon className="h-6 w-6" />
              {currentTier.toUpperCase()}
            </h3>
          </div>
          {currentTier !== 'institutional' && (
            <TrendingUp className="h-8 w-8 text-white/60" />
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalInvested.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Staked</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalStaked.toLocaleString()} ICO2
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Investments</p>
            <p className="text-2xl font-bold text-gray-900">{stats.investmentCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.monthlyInvested.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Upgrade Info */}
        {upgradeInfo && currentTier !== 'institutional' && (
          <div className={`p-4 rounded-lg ${
            upgradeInfo.canUpgrade ? 'bg-green-50 border-2 border-green-500' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                upgradeInfo.canUpgrade ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {upgradeInfo.canUpgrade ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  upgradeInfo.canUpgrade ? 'text-green-900' : 'text-blue-900'
                }`}>
                  {upgradeInfo.canUpgrade ? 'Upgrade Available!' : 'Next Tier Progress'}
                </h4>
                <p className={`text-sm mt-1 ${
                  upgradeInfo.canUpgrade ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {upgradeInfo.reason}
                </p>
                {!upgradeInfo.canUpgrade && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.min(
                        100,
                        (stats.totalInvested / upgradeInfo.requirements.minimumInvestment) * 100
                      ).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats.totalInvested / upgradeInfo.requirements.minimumInvestment) * 100
                          )}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {upgradeInfo.canUpgrade && (
              <button
                onClick={checkUpgrade}
                disabled={checking}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {checking ? 'Upgrading...' : 'Upgrade Now'}
              </button>
            )}
          </div>
        )}

        {/* Current Benefits */}
        <div>
          <h4 className="font-semibold mb-3">Your Current Benefits</h4>
          <div className="space-y-2">
            {tierService.getTierBenefits(currentTier).slice(0, 5).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
