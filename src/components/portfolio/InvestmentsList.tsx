import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Investment {
  id: number;
  projectName: string;
  projectId: number;
  amount: number;
  currentValue: number;
  returns: number;
  roi: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  investmentDate: string;
  tokens: number;
  carbonCredits: number;
}

interface InvestmentsListProps {
  investments: Investment[];
  onViewDetails?: (investment: Investment) => void;
}

const InvestmentsList: React.FC<InvestmentsListProps> = ({
  investments,
  onViewDetails,
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'roi'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter investments
  const filteredInvestments = investments.filter((inv) => {
    if (filterStatus === 'all') return true;
    return inv.status === filterStatus;
  });

  // Sort investments
  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.investmentDate).getTime() - new Date(b.investmentDate).getTime();
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'roi') {
      comparison = a.roi - b.roi;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusBadge = (status: Investment['status']) => {
    const statusConfig = {
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Onaylandı', color: 'bg-blue-100 text-blue-700' },
      active: { label: 'Aktif', color: 'bg-green-100 text-green-700' },
      completed: { label: 'Tamamlandı', color: 'bg-gray-100 text-gray-700' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700' },
    };
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Yatırımlarım</h3>
            <p className="text-sm text-gray-500 mt-1">
              Toplam {investments.length} yatırım
            </p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="active">Aktif</option>
            <option value="completed">Tamamlandı</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Tarihe Göre</option>
            <option value="amount">Tutara Göre</option>
            <option value="roi">ROI'ye Göre</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑ Artan' : '↓ Azalan'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mevcut Değer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Getiri
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvestments.map((investment, index) => (
              <motion.tr
                key={investment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {investment.projectName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {investment.tokens.toFixed(2)} DCB Token
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ₺{investment.amount.toLocaleString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    ₺{investment.currentValue.toLocaleString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-semibold ${
                      investment.returns >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {investment.returns >= 0 ? '+' : ''}₺
                    {investment.returns.toLocaleString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-semibold ${
                      investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {investment.roi >= 0 ? '+' : ''}
                    {investment.roi.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(investment.investmentDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(investment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails?.(investment)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Detaylar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {sortedInvestments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Yatırım bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsList;
