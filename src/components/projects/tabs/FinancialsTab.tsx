/**
 * Financials Tab Component
 * Token economics, Revenue model, Historical returns, Risk assessment
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  AlertTriangle,
  Shield,
  BarChart3,
} from 'lucide-react';
import { EnhancedProject } from '../../../types/project-enhanced';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinancialsTabProps {
  project: EnhancedProject;
}

export default function FinancialsTab({ project }: FinancialsTabProps) {
  const tokenEconomics = project.tokenEconomics;
  const revenueModel = project.revenueModel;
  const historicalReturns = project.historicalReturns;
  const riskAssessment = project.riskAssessment;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Token Economics */}
        {tokenEconomics && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Token Ekonomisi
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Token Sembolü</div>
                <div className="text-2xl font-bold text-purple-700">
                  {tokenEconomics.tokenSymbol}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Mevcut Fiyat</div>
                <div className="text-2xl font-bold text-blue-700">
                  ${tokenEconomics.currentPrice}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Piyasa Değeri</div>
                <div className="text-2xl font-bold text-green-700">
                  ${(tokenEconomics.marketCap / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">24h Hacim</div>
                <div className="text-2xl font-bold text-orange-700">
                  ${(tokenEconomics.tradingVolume24h / 1000).toFixed(0)}K
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenEconomics.priceHistory}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString('tr-TR', { month: 'short' })
                    }
                    stroke="#9ca3af"
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Fiyat']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('tr-TR')}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Arz</span>
                <span className="font-medium text-gray-900">
                  {tokenEconomics.totalSupply.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dolaşımdaki Arz</span>
                <span className="font-medium text-gray-900">
                  {tokenEconomics.circulatingSupply.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Revenue Model */}
        {revenueModel && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Gelir Modeli
            </h2>

            {/* Revenue Sources */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Gelir Kaynakları</h3>
              <div className="space-y-3">
                {revenueModel.sources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{source.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{source.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projected Revenue Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueModel.projectedRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${(value / 1000000).toFixed(2)}M`,
                      'Gelir',
                    ]}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <strong>Ödeme Programı:</strong>{' '}
              {revenueModel.paymentSchedule === 'monthly'
                ? 'Aylık'
                : revenueModel.paymentSchedule === 'quarterly'
                ? 'Üç Aylık'
                : 'Yıllık'}
            </div>
          </section>
        )}

        {/* Historical Returns */}
        {historicalReturns && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Tarihsel Getiriler
            </h2>

            {/* ROI by Period */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {historicalReturns.roi.map((item) => (
                <div
                  key={item.period}
                  className={`text-center p-3 rounded-lg ${
                    item.percentage >= 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="text-xs text-gray-600 mb-1">{item.period}</div>
                  <div
                    className={`text-lg font-bold ${
                      item.percentage >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {item.percentage > 0 ? '+' : ''}
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Kıyaslama (Yıllık Getiri)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bu Proje</span>
                  <span className="text-lg font-bold text-green-700">
                    +{historicalReturns.benchmarkComparison.project}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sektör Ortalaması</span>
                  <span className="text-sm font-medium text-gray-700">
                    +{historicalReturns.benchmarkComparison.sectorAverage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Piyasa Endeksi</span>
                  <span className="text-sm font-medium text-gray-700">
                    +{historicalReturns.benchmarkComparison.marketIndex}%
                  </span>
                </div>
              </div>
            </div>

            {/* Distributions Table */}
            {historicalReturns.distributions.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Geçmiş Dağıtımlar</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-600">Tarih</th>
                        <th className="px-4 py-2 text-right text-gray-600">
                          Token Başına
                        </th>
                        <th className="px-4 py-2 text-right text-gray-600">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalReturns.distributions.slice(0, 5).map((dist, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-gray-900">
                            {new Date(dist.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-900">
                            ${dist.amountPerToken.toFixed(4)}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">
                            ${dist.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Right Column - Risk Assessment */}
      <div className="space-y-6">
        {riskAssessment && (
          <>
            {/* Overall Risk */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                Risk Değerlendirmesi
              </h2>

              {/* Risk Level */}
              <div
                className={`p-4 rounded-lg mb-4 ${
                  riskAssessment.overall === 'low'
                    ? 'bg-green-50 border border-green-200'
                    : riskAssessment.overall === 'medium'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">Genel Risk Seviyesi</div>
                <div
                  className={`text-2xl font-bold ${
                    riskAssessment.overall === 'low'
                      ? 'text-green-700'
                      : riskAssessment.overall === 'medium'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}
                >
                  {riskAssessment.overall === 'low'
                    ? 'Düşük'
                    : riskAssessment.overall === 'medium'
                    ? 'Orta'
                    : 'Yüksek'}
                </div>
              </div>

              {/* Audit Score */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-1">Denetim Skoru</div>
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-indigo-700">
                    {riskAssessment.auditScore}
                  </div>
                  <div className="text-sm text-gray-600">/100</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${riskAssessment.auditScore}%` }}
                  />
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Risk Faktörleri</h3>
                {riskAssessment.factors.map((factor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            factor.level === 'low'
                              ? 'text-green-600'
                              : factor.level === 'medium'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {factor.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          factor.level === 'low'
                            ? 'bg-green-100 text-green-700'
                            : factor.level === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {factor.level === 'low'
                          ? 'Düşük'
                          : factor.level === 'medium'
                          ? 'Orta'
                          : 'Yüksek'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{factor.description}</p>
                    {factor.mitigation && (
                      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <strong>Önlem:</strong> {factor.mitigation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Insurance Coverage */}
              {riskAssessment.insuranceCoverage && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    Sigorta Kapsamı
                  </h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div>
                      <strong>Sağlayıcı:</strong>{' '}
                      {riskAssessment.insuranceCoverage.provider}
                    </div>
                    <div>
                      <strong>Tutar:</strong> $
                      {riskAssessment.insuranceCoverage.amount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Kapsam:</strong>{' '}
                      {riskAssessment.insuranceCoverage.coverage.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
