import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Clock,
  Users
} from 'lucide-react';

export const TradingPage: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('DCB/USDT');
  const [orderType, setOrderType] = useState('market');
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const priceData = [
    { time: '09:00', price: 0.245, volume: 1200 },
    { time: '10:00', price: 0.248, volume: 1450 },
    { time: '11:00', price: 0.252, volume: 1680 },
    { time: '12:00', price: 0.249, volume: 1320 },
    { time: '13:00', price: 0.255, volume: 1890 },
    { time: '14:00', price: 0.258, volume: 2100 },
    { time: '15:00', price: 0.262, volume: 2350 },
    { time: '16:00', price: 0.259, volume: 1980 },
  ];

  const tradingPairs = [
    { pair: 'DCB/USDT', price: 0.259, change: '+5.2%', volume: '2.4M', high: 0.265, low: 0.242 },
    { pair: 'DCB/BTC', price: 0.0000062, change: '+3.8%', volume: '1.8M', high: 0.0000065, low: 0.0000059 },
    { pair: 'DCB/ETH', price: 0.000156, change: '+7.1%', volume: '1.2M', high: 0.000162, low: 0.000148 },
    { pair: 'DCB/BNB', price: 0.00089, change: '+2.4%', volume: '890K', high: 0.00092, low: 0.00085 },
  ];

  const orderBook = {
    asks: [
      { price: 0.262, amount: 15420, total: 4040.04 },
      { price: 0.261, amount: 8950, total: 2335.95 },
      { price: 0.260, amount: 12300, total: 3198.00 },
      { price: 0.259, amount: 6780, total: 1756.02 },
    ],
    bids: [
      { price: 0.258, amount: 9840, total: 2538.72 },
      { price: 0.257, amount: 11200, total: 2878.40 },
      { price: 0.256, amount: 7650, total: 1958.40 },
      { price: 0.255, amount: 13400, total: 3417.00 },
    ]
  };

  const recentTrades = [
    { price: 0.259, amount: 1250, time: '16:45:23', type: 'buy' },
    { price: 0.258, amount: 890, time: '16:45:18', type: 'sell' },
    { price: 0.259, amount: 2100, time: '16:45:12', type: 'buy' },
    { price: 0.257, amount: 750, time: '16:45:08', type: 'sell' },
    { price: 0.258, amount: 1680, time: '16:45:02', type: 'buy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trading</h1>
            <p className="text-gray-600">DCB Token ve karbon kredisi ticareti yapın</p>
          </motion.div>
        </div>

        {/* Trading Pairs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">İşlem Çiftleri</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tradingPairs.map((pair, index) => (
              <div
                key={pair.pair}
                onClick={() => setSelectedPair(pair.pair)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedPair === pair.pair
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{pair.pair}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    pair.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {pair.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">${pair.price}</div>
                <div className="text-sm text-gray-600">
                  <div>Vol: {pair.volume}</div>
                  <div>H: ${pair.high} L: ${pair.low}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedPair} Fiyat Grafiği</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">+5.2%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$0.259</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Volume Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">İşlem Hacmi</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-8">
            {/* Order Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Emir Ver</h3>
              
              {/* Trade Type Tabs */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'buy'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Alım
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    tradeType === 'sell'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Satım
                </button>
              </div>

              {/* Order Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Emir Türü</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                </select>
              </div>

              {/* Price Input */}
              {orderType !== 'market' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (USDT)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Miktar (DCB)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {['25%', '50%', '75%', '100%'].map((percentage) => (
                  <button
                    key={percentage}
                    className="py-2 px-3 text-sm border border-gray-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    {percentage}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  tradeType === 'buy'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {tradeType === 'buy' ? 'Satın Al' : 'Sat'} DCB
              </button>
            </motion.div>

            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Emir Defteri</h3>
              
              {/* Asks */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">Satış Emirleri</div>
                {orderBook.asks.map((ask, index) => (
                  <div key={index} className="flex justify-between items-center py-1 text-sm">
                    <span className="text-red-600">${ask.price}</span>
                    <span className="text-gray-600">{ask.amount.toLocaleString()}</span>
                    <span className="text-gray-500">${ask.total}</span>
                  </div>
                ))}
              </div>

              {/* Current Price */}
              <div className="text-center py-3 border-y border-gray-200 mb-4">
                <div className="text-2xl font-bold text-emerald-600">$0.259</div>
                <div className="text-sm text-gray-600">Son Fiyat</div>
              </div>

              {/* Bids */}
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Alış Emirleri</div>
                {orderBook.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center py-1 text-sm">
                    <span className="text-emerald-600">${bid.price}</span>
                    <span className="text-gray-600">{bid.amount.toLocaleString()}</span>
                    <span className="text-gray-500">${bid.total}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Trades */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Son İşlemler</h3>
              <div className="space-y-2">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className={trade.type === 'buy' ? 'text-emerald-600' : 'text-red-600'}>
                      ${trade.price}
                    </span>
                    <span className="text-gray-600">{trade.amount}</span>
                    <span className="text-gray-500">{trade.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};