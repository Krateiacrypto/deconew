import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Shield, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import toast from 'react-hot-toast';

export const WalletConnect: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  const { 
    isConnected, 
    address, 
    balance, 
    network, 
    connectWallet, 
    disconnectWallet,
    switchNetwork 
  } = useWalletStore();

  const walletOptions = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'En popüler Ethereum cüzdanı',
      type: 'metamask'
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Mobil cüzdanlar için',
      type: 'walletconnect'
    },
    {
      name: 'Reef Extension',
      icon: '🐠',
      description: 'ReefChain için özel cüzdan',
      type: 'reef'
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Güvenli mobil cüzdan',
      type: 'trust'
    }
  ];

  const handleConnect = async (walletType: string) => {
    setIsConnecting(true);
    try {
      await connectWallet(walletType);
      setShowWalletModal(false);
      toast.success('Cüzdan başarıyla bağlandı!');
    } catch (error) {
      toast.error('Cüzdan bağlantısı başarısız!');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Cüzdan bağlantısı kesildi');
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      toast.success('Adres kopyalandı!');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    return parseFloat(bal).toFixed(4);
  };

  if (isConnected && address) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cüzdan Bağlı</h3>
              <p className="text-sm text-emerald-600">ReefChain Network</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Aktif</span>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Cüzdan Adresi</p>
              <p className="font-mono text-gray-900">{formatAddress(address)}</p>
            </div>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedAddress ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-600 mb-1">CO₂ Token Bakiyesi</p>
              <p className="text-2xl font-bold text-emerald-700">
                {formatBalance(balance)} CO₂
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">REEF Bakiyesi</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatBalance('0')} REEF
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center space-x-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Zap className="w-4 h-4" />
            <span>CO₂ Gönder</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>Explorer</span>
          </button>
        </div>

        {/* Network Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Network: {network}</span>
          </div>
          {network !== 'ReefChain' && (
            <button
              onClick={() => switchNetwork('ReefChain')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ReefChain'e Geç
            </button>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          className="w-full p-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Cüzdan Bağlantısını Kes
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CO₂</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cüzdan Bağla</h3>
          <p className="text-gray-600">
            CO₂ token işlemleriniz için cüzdanınızı bağlayın
          </p>
        </div>

        <button
          onClick={() => setShowWalletModal(true)}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>Cüzdan Bağla</span>
        </button>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Güvenlik Uyarısı</p>
              <p className="text-xs text-amber-700 mt-1">
                Cüzdanınızı sadece güvenilir sitelerde bağlayın. Private key'inizi asla paylaşmayın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cüzdan Seçin</h3>
                <p className="text-gray-600">Bağlanmak istediğiniz cüzdanı seçin</p>
              </div>

              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.type}
                    onClick={() => handleConnect(wallet.type)}
                    disabled={isConnecting}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">{wallet.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{wallet.name}</p>
                      <p className="text-sm text-gray-600">{wallet.description}</p>
                    </div>
                    {isConnecting && (
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Bilgi</p>
                    <p className="text-xs text-blue-700 mt-1">
                      ReefChain network'ü için cüzdanınızı yapılandırmanız gerekebilir.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full mt-4 p-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};