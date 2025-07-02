import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Clock,
  DollarSign,
  Plus,
  Minus,
  Gift
} from 'lucide-react';
import { useStakingStore } from '../../store/stakingStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const StakingDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    pools, 
    positions, 
    fetchStakingPools, 
    fetchUserPositions,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    isLoading 
  } = useStakingStore();
  
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);

  useEffect(() => {
    fetchStakingPools();
    if (user?.id) {
      fetchUserPositions(user.id);
    }
  }, [user?.id, fetchStakingPools, fetchUserPositions]);

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || !user?.id) return;

    try {
      await stakeTokens(selectedPool, parseFloat(stakeAmount), user.id);
      toast.success('Staking işlemi başarılı!');
      setShowStakeModal(false);
      setStakeAmount('');
      setSelectedPool(null);
    } catch (error) {
      toast.error('Staking işlemi başarısız!');
    }
  };

  const handleUnstake = async (positionId: string) => {
    try {
      await unstakeTokens(positionId);
      toast.success('Unstaking işlemi başarılı!');
    } catch (error) {
      toast.error('Unstaking işlemi başarısız!');
    }
  };

  const handleClaimRewards = async (positionId: string) => {
    try {
      await claimRewards(positionId);
      toast.success('Ödüller başarıyla talep edildi!');
    } catch (error) {
      toast.error('Ödül talep işlemi başarısız!');
    }
  };

  const totalStaked = positions.reduce((sum, pos) => 
    pos.status === 'active' ? sum + pos.amount : sum, 0
  );
  
  const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Toplam Stake</h3>
              <p className="text-2xl font-bold text-emerald-600">{totalStaked.toLocaleString()} DCB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Toplam Ödül</h3>
              <p className="text-2xl font-bold text-blue-600">{totalRewards.toFixed(2)} DCB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Aktif Pozisyon</h3>
              <p className="text-2xl font-bold text-purple-600">{positions.filter(p => p.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Pools */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Staking Havuzları</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{pool.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pool.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {pool.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">APY</span>
                  <span className="font-bold text-emerald-600">{pool.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min. Stake</span>
                  <span className="font-medium">{pool.minimumStake} {pool.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilit Süresi</span>
                  <span className="font-medium">{pool.lockPeriod} gün</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Katılımcı</span>
                  <span className="font-medium">{pool.participants.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPool(pool.id);
                  setShowStakeModal(true);
                }}
                disabled={pool.status !== 'active'}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Stake Et
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Positions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Staking Pozisyonlarım</h3>

        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Havuz</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Miktar</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Ödül</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Bitiş Tarihi</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const pool = pools.find(p => p.id === position.poolId);
                  return (
                    <tr key={position.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium">{pool?.name}</td>
                      <td className="py-4 px-4">{position.amount.toLocaleString()} {pool?.tokenSymbol}</td>
                      <td className="py-4 px-4 text-emerald-600 font-medium">
                        {position.rewards.toFixed(4)} {pool?.tokenSymbol}
                      </td>
                      <td className="py-4 px-4">
                        {new Date(position.endDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          position.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          position.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {position.status === 'active' ? 'Aktif' :
                           position.status === 'completed' ? 'Tamamlandı' : 'Çekildi'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {position.status === 'active' && position.rewards > 0 && (
                            <button
                              onClick={() => handleClaimRewards(position.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                            >
                              Ödül Al
                            </button>
                          )}
                          {position.status === 'active' && new Date(position.endDate) <= new Date() && (
                            <button
                              onClick={() => handleUnstake(position.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Unstake
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz staking pozisyonunuz yok</h4>
            <p className="text-gray-600">Yukarıdaki havuzlardan birini seçerek staking yapmaya başlayın</p>
          </div>
        )}
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Token Stake Et</h3>
            
            {(() => {
              const pool = pools.find(p => p.id === selectedPool);
              return (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{pool?.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>APY: <span className="font-medium text-emerald-600">{pool?.apy}%</span></div>
                      <div>Min. Stake: {pool?.minimumStake} {pool?.tokenSymbol}</div>
                      <div>Kilit Süresi: {pool?.lockPeriod} gün</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stake Miktarı ({pool?.tokenSymbol})
                    </label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      min={pool?.minimumStake}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={`Min. ${pool?.minimumStake}`}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowStakeModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleStake}
                      disabled={!stakeAmount || parseFloat(stakeAmount) < (pool?.minimumStake || 0) || isLoading}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Stake Ediliyor...' : 'Stake Et'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
    </div>
  );
};