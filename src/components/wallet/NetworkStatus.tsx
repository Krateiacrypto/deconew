import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Activity, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';

export const NetworkStatus: React.FC = () => {
  const { isConnected, network, chainId } = useWalletStore();

  // Mock network data - in real app, this would come from blockchain APIs
  const networkStats = {
    blockHeight: 2847392,
    gasPrice: '0.8',
    tps: 1247,
    validators: 156,
    totalStaked: '45.2M',
    apr: '12.4%'
  };

  const getNetworkStatus = () => {
    if (!isConnected) return { status: 'disconnected', color: 'gray' };
    if (network === 'ReefChain') return { status: 'connected', color: 'green' };
    return { status: 'wrong-network', color: 'amber' };
  };

  const { status, color } = getNetworkStatus();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
            <Globe className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Network Durumu</h3>
            <p className="text-sm text-gray-600">ReefChain Mainnet</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {status === 'connected' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {status === 'wrong-network' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {status === 'disconnected' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
          
          <span className={`text-sm font-medium text-${color}-600`}>
            {status === 'connected' && 'Bağlı'}
            {status === 'wrong-network' && 'Yanlış Network'}
            {status === 'disconnected' && 'Bağlı Değil'}
          </span>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Blok Yüksekliği</span>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {networkStats.blockHeight.toLocaleString()}
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Gas Fiyatı</span>
          </div>
          <p className="text-lg font-bold text-emerald-900">
            {networkStats.gasPrice} Gwei
          </p>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">TPS</span>
          </div>
          <p className="text-lg font-bold text-purple-900">
            {networkStats.tps.toLocaleString()}
          </p>
        </div>

        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Blok Süresi</span>
          </div>
          <p className="text-lg font-bold text-orange-900">
            ~3s
          </p>
        </div>
      </div>

      {/* Staking Info */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <h4 className="font-medium text-gray-900 mb-3">Staking Bilgileri</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Validator Sayısı</p>
            <p className="font-bold text-gray-900">{networkStats.validators}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Toplam Stake</p>
            <p className="font-bold text-gray-900">{networkStats.totalStaked}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">APR</p>
            <p className="font-bold text-emerald-600">{networkStats.apr}</p>
          </div>
        </div>
      </div>

      {/* CO₂ Token Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">CO₂ Token Bilgileri</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Contract Address:</span>
            <span className="font-mono text-gray-900">0x1234...7890</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Supply:</span>
            <span className="font-medium text-gray-900">1,000,000,000 CO₂</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Circulating Supply:</span>
            <span className="font-medium text-gray-900">250,000,000 CO₂</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isConnected && status === 'connected' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
            CO₂ Stake Et
          </button>
          <button className="p-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium">
            Explorer'da Görüntüle
          </button>
        </div>
      )}
    </div>
  );
};