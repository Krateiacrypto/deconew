/**
 * Verification Tab Component
 * Certifications, Audit reports, Blockchain transactions, Third-party reviews
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Link as LinkIcon,
  Star,
  CheckCircle,
  ExternalLink,
  Download,
} from 'lucide-react';
import { EnhancedProject } from '../../../types/project-enhanced';

interface VerificationTabProps {
  project: EnhancedProject;
}

export default function VerificationTab({ project }: VerificationTabProps) {
  const verification = project.verification;

  if (!verification) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Doğrulama bilgisi mevcut değil</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Certifications */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Sertifikalar
          </h2>
          <div className="space-y-4">
            {verification.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    {cert.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">
                        Sertifika Veren: {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <a
                    href={cert.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 ml-8">
                  <span>
                    Verilme: {new Date(cert.issueDate).toLocaleDateString('tr-TR')}
                  </span>
                  {cert.expiryDate && (
                    <span>
                      Son Geçerlilik:{' '}
                      {new Date(cert.expiryDate).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Audit Reports */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Denetim Raporları
          </h2>
          <div className="space-y-4">
            {verification.auditReports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.auditor}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString('tr-TR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        {report.score}
                      </div>
                      <div className="text-xs text-gray-500">/100</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{report.summary}</p>
                <a
                  href={report.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <span>Raporu İncele</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Blockchain Transactions */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-purple-600" />
            Blockchain İşlemleri
          </h2>
          <div className="space-y-3">
            {verification.blockchainTransactions.slice(0, 10).map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        tx.type === 'funding'
                          ? 'bg-green-100 text-green-700'
                          : tx.type === 'carbon_credit'
                          ? 'bg-blue-100 text-blue-700'
                          : tx.type === 'milestone'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {tx.type.replace('_', ' ').toUpperCase()}
                    </span>
                    {tx.verified && (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  <div className="font-mono text-xs text-gray-600 truncate">
                    {tx.hash}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString('tr-TR')}
                    {tx.amount && <span className="ml-2">${tx.amount.toLocaleString()}</span>}
                  </div>
                </div>
                <button
                  onClick={() => window.open(`https://reefscan.com/tx/${tx.hash}`, '_blank')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
          {verification.blockchainTransactions.length > 10 && (
            <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              Tüm İşlemleri Görüntüle ({verification.blockchainTransactions.length})
            </button>
          )}
        </section>

        {/* Third-Party Reviews */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Uzman Değerlendirmeleri
          </h2>
          <div className="space-y-4">
            {verification.thirdPartyReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.reviewer}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.summary}</p>
                {review.fullReviewUrl && (
                  <a
                    href={review.fullReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <span>Tam İnceleme</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Verification Summary */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4">Doğrulama Özeti</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sertifika Sayısı</span>
              <span className="font-semibold text-gray-900">
                {verification.certifications.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doğrulanmış Sertifikalar</span>
              <span className="font-semibold text-green-700">
                {verification.certifications.filter((c) => c.verified).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Denetim Raporları</span>
              <span className="font-semibold text-gray-900">
                {verification.auditReports.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ortalama Denetim Skoru</span>
              <span className="font-semibold text-blue-700">
                {(
                  verification.auditReports.reduce((sum, r) => sum + r.score, 0) /
                  verification.auditReports.length
                ).toFixed(1)}
                /100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Blockchain İşlemleri</span>
              <span className="font-semibold text-gray-900">
                {verification.blockchainTransactions.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doğrulanmış İşlemler</span>
              <span className="font-semibold text-purple-700">
                {verification.blockchainTransactions.filter((tx) => tx.verified).length}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
