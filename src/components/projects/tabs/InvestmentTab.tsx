/**
 * Investment Tab Component
 * Investment amount selector, Token calculator, Returns simulator, Transaction flow
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { EnhancedProject, InvestmentCalculation } from '../../../types/project-enhanced';
import ImpactCalculator from '../ImpactCalculator';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface InvestmentTabProps {
  project: EnhancedProject;
}

export default function InvestmentTab({ project }: InvestmentTabProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [amount, setAmount] = useState<number>(1000);
  const [calculation, setCalculation] = useState<InvestmentCalculation | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'calculate' | 'review' | 'confirm'>('calculate');

  const minInvestment = project.investmentRange?.min || 100;
  const maxInvestment = project.investmentRange?.max || 1000000;

  const handleCalculate = (calc: InvestmentCalculation) => {
    setCalculation(calc);
  };

  const handleProceedToReview = () => {
    if (!calculation) return;
    if (amount < minInvestment) {
      alert(`Minimum yatırım miktarı $${minInvestment.toLocaleString()}`);
      return;
    }
    if (amount > maxInvestment) {
      alert(`Maksimum yatırım miktarı $${maxInvestment.toLocaleString()}`);
      return;
    }
    setStep('review');
  };

  const handleConfirmInvestment = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${project.id}` } });
      return;
    }
    if (!agreed) {
      alert('Lütfen şartları ve koşulları kabul edin');
      return;
    }
    // TODO: Implement actual investment transaction
    alert('Yatırım işlemi başlatılıyor... (Blockchain entegrasyonu gerekli)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Investment Calculator */}
      <div className="lg:col-span-2 space-y-6">
        {/* Step Indicator */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            {[
              { id: 'calculate', label: 'Hesapla' },
              { id: 'review', label: 'İncele' },
              { id: 'confirm', label: 'Onayla' },
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step === s.id
                        ? 'bg-green-600 text-white'
                        : idx <
                          ['calculate', 'review', 'confirm'].indexOf(step)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx <
                    ['calculate', 'review', 'confirm'].indexOf(step) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step === s.id ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      idx < ['calculate', 'review', 'confirm'].indexOf(step)
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step: Calculate */}
        {step === 'calculate' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Yatırım Hesaplayıcı
            </h2>
            <ImpactCalculator project={project} onCalculate={handleCalculate} />
            {calculation && (
              <button
                onClick={handleProceedToReview}
                className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Devam Et</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </motion.div>
        )}

        {/* Step: Review */}
        {step === 'review' && calculation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Investment Summary */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Yatırım Özeti
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Yatırım Miktarı</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${calculation.investmentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Ücreti (2%)</span>
                  <span className="text-gray-900">
                    -${calculation.fees.platform.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">İşlem Ücreti (0.5%)</span>
                  <span className="text-gray-900">
                    -${calculation.fees.transaction.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Net Yatırım
                  </span>
                  <span className="text-2xl font-bold text-green-700">
                    ${calculation.netInvestment.toLocaleString()}
                  </span>
                </div>
              </div>
            </section>

            {/* Expected Returns */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Beklenen Getiriler
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Aylık</div>
                  <div className="text-xl font-bold text-blue-700">
                    ${calculation.estimatedReturns.monthly.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Yıllık</div>
                  <div className="text-xl font-bold text-blue-700">
                    ${calculation.estimatedReturns.yearly.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">5 Yıl</div>
                  <div className="text-xl font-bold text-blue-700">
                    ${calculation.estimatedReturns.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </section>

            {/* Token Details */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Token Detayları
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Alacağınız Token</span>
                  <span className="font-bold text-purple-700">
                    {calculation.tokensReceived.toLocaleString()}{' '}
                    {project.tokenEconomics?.tokenSymbol || 'DCB'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token Başına Fiyat</span>
                  <span className="text-gray-900">
                    ${project.tokenEconomics?.currentPrice || 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Karbon Kredisi</span>
                  <span className="text-green-700 font-medium">
                    {calculation.carbonCredits.toFixed(2)} ton CO₂
                  </span>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('calculate')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Geri Dön
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Yatırıma Devam Et</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && calculation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Transaction Preview */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                İşlem Önizlemesi
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Yatırım</span>
                    <span className="text-2xl font-bold text-green-700">
                      ${calculation.investmentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {calculation.tokensReceived.toLocaleString()}{' '}
                    {project.tokenEconomics?.tokenSymbol} token alacaksınız
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        Cüzdan Adresi
                      </div>
                      <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                        {user?.walletAddress || 'Bağlı cüzdan yok'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms & Conditions */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Şartlar ve Koşullar
              </h3>
              <div className="space-y-3 text-sm text-gray-700 mb-4 max-h-40 overflow-y-auto bg-gray-50 p-4 rounded">
                <p>
                  1. Bu yatırım risk içermektedir ve sermaye kaybı yaşayabilirsiniz.
                </p>
                <p>
                  2. Tahmini getiriler garanti edilmemektedir ve piyasa koşullarına
                  bağlı olarak değişebilir.
                </p>
                <p>
                  3. Tokenler blockchain üzerinde saklanacak ve transferi geri
                  alınamaz.
                </p>
                <p>
                  4. Platform ücretleri ve işlem ücretleri iade edilmez.
                </p>
                <p>
                  5. Proje hedeflerine ulaşamaz ise fonlar proje sahiplerine
                  aktarılmayacaktır.
                </p>
              </div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  Yukarıdaki şartları ve koşulları okudum, anladım ve kabul ediyorum
                </span>
              </label>
            </section>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('review')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Geri Dön
              </button>
              <button
                onClick={handleConfirmInvestment}
                disabled={!agreed}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
                  agreed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Zap className="h-5 w-5" />
                <span>Yatırımı Onayla</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Investment Limits */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            Yatırım Limitleri
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum</span>
              <span className="font-semibold text-gray-900">
                ${minInvestment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maksimum</span>
              <span className="font-semibold text-gray-900">
                ${maxInvestment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ortalama Yatırım</span>
              <span className="font-semibold text-green-700">
                ${project.averageInvestment?.toLocaleString() || '-'}
              </span>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-indigo-600" />
            Güvenlik Özellikleri
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-gray-700">Blockchain üzerinde şeffaf</span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-gray-700">Smart contract koruması</span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-gray-700">Denetlenmiş proje</span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span className="text-gray-700">Sigorta kapsamında</span>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Wallet className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-700">MetaMask Cüzdanı</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Kredi/Banka Kartı</span>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-start space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <h3 className="font-semibold text-gray-900">Risk Uyarısı</h3>
          </div>
          <p className="text-xs text-gray-700">
            Bu yatırım risk içermektedir. Yatırım yapmadan önce projenin detaylarını
            dikkatlice inceleyin ve sadece kaybetmeyi göze alabileceğiniz sermaye ile
            yatırım yapın.
          </p>
        </section>
      </div>
    </div>
  );
}
