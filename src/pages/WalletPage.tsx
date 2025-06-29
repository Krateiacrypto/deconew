import React from 'react';
import { motion } from 'framer-motion';
import { WalletConnect } from '../components/wallet/WalletConnect';
import { TokenTransfer } from '../components/wallet/TokenTransfer';
import { NetworkStatus } from '../components/wallet/NetworkStatus';
import { useWalletStore } from '../store/walletStore';

export const WalletPage: React.FC = () => {
  const { isConnected } = useWalletStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blockchain Cüzdan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CO₂ token'larınızı yönetin, transfer edin ve ReefChain network'ü ile etkileşime geçin
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <WalletConnect />
          </motion.div>

          {/* Token Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <TokenTransfer />
          </motion.div>

          {/* Network Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <NetworkStatus />
          </motion.div>
        </div>

        {/* Additional Features */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold">CO₂</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Token Staking</h3>
              <p className="text-gray-600 text-sm mb-4">CO₂ token'larınızı stake ederek getiri elde edin</p>
              <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Stake Et
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Portfolio</h3>
              <p className="text-gray-600 text-sm mb-4">Token portföyünüzü detaylı olarak görüntüleyin</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Görüntüle
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">🔄</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Swap</h3>
              <p className="text-gray-600 text-sm mb-4">Token'larınızı diğer kripto paralarla değiştirin</p>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Swap Yap
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold">📈</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">İşlem geçmişinizi ve analizlerinizi görün</p>
              <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Analiz Et
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};