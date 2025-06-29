import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  ArrowRight, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Zap,
  DollarSign
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import toast from 'react-hot-toast';

export const TokenTransfer: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'CO2' | 'REEF'>('CO2');
  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState('');
  
  const { isConnected, address, balance, sendTransaction } = useWalletStore();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast.error('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Geçerli bir miktar girin');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error('Yetersiz bakiye');
      return;
    }

    setIsTransferring(true);
    
    try {
      const hash = await sendTransaction(recipient, amount, tokenType);
      setTxHash(hash);
      toast.success('Transfer başarılı!');
      
      // Reset form
      setRecipient('');
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Transfer başarısız');
    } finally {
      setIsTransferring(false);
    }
  };

  const validateAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const getMaxAmount = () => {
    return tokenType === 'CO2' ? balance : '0'; // Mock REEF balance
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Token Transfer</h3>
          <p className="text-gray-600 mb-4">
            Token transferi yapmak için cüzdanınızı bağlayın
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Send className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Token Transfer</h3>
          <p className="text-sm text-gray-600">CO₂ ve REEF token transferi</p>
        </div>
      </div>

      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Transfer Başarılı!</p>
              <p className="text-xs text-green-700 mt-1">
                TX Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleTransfer} className="space-y-6">
        {/* Token Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Token Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTokenType('CO2')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                tokenType === 'CO2'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">CO₂</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">CO₂ Token</p>
                  <p className="text-xs text-gray-600">{balance} CO₂</p>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setTokenType('REEF')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                tokenType === 'REEF'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">REEF</p>
                  <p className="text-xs text-gray-600">0 REEF</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alıcı Adresi
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm ${
              recipient && !validateAddress(recipient)
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
          />
          {recipient && !validateAddress(recipient) && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>Geçersiz cüzdan adresi</span>
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Miktar
            </label>
            <button
              type="button"
              onClick={() => setAmount(getMaxAmount())}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Maksimum: {getMaxAmount()} {tokenType}
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.0001"
              min="0"
              max={getMaxAmount()}
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-gray-500 font-medium">{tokenType}</span>
            </div>
          </div>
        </div>

        {/* Gas Fee Estimation */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tahmini Gas Ücreti</span>
            <span className="text-sm font-medium text-gray-900">~0.001 REEF</span>
          </div>
        </div>

        {/* Transfer Button */}
        <button
          type="submit"
          disabled={
            isTransferring || 
            !recipient || 
            !amount || 
            !validateAddress(recipient) ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > parseFloat(getMaxAmount())
          }
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isTransferring ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Transfer Ediliyor...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Transfer Et</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Transaction History Link */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full text-center text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          İşlem Geçmişini Görüntüle
        </button>
      </div>
    </div>
  );
};