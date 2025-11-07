/**
 * Impact Calculator Component
 * Calculate environmental impact based on investment amount
 */

import React, { useState, useEffect } from 'react';
import { Leaf, Car, TreePine, Droplet, Zap, Calculator } from 'lucide-react';
import { EnhancedProject, InvestmentCalculation } from '../../types/project-enhanced';

interface ImpactCalculatorProps {
  project: EnhancedProject;
  onCalculate?: (calculation: InvestmentCalculation) => void;
}

export default function ImpactCalculator({ project, onCalculate }: ImpactCalculatorProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [calculation, setCalculation] = useState<InvestmentCalculation | null>(null);

  useEffect(() => {
    calculateImpact(amount);
  }, [amount, project]);

  const calculateImpact = (investmentAmount: number) => {
    // Calculate based on project data
    const totalSupply = project.tokenEconomics?.totalSupply || 1000000;
    const tokenPrice = project.tokenEconomics?.currentPrice || 1;
    const totalCO2 = project.carbonImpact?.totalCO2Reduction || 10000;
    const projectGoal = project.fundingGoal || 1000000;

    // Investment calculations
    const tokensReceived = investmentAmount / tokenPrice;
    const investmentPercentage = (investmentAmount / projectGoal) * 100;

    // Carbon impact calculations
    const co2Reduced = (totalCO2 * investmentPercentage) / 100;
    const treesEquivalent = Math.floor(co2Reduced * 50); // ~50 trees per ton CO2
    const carsOffRoad = Math.floor(co2Reduced / 4.6); // ~4.6 tons CO2 per car/year

    // Fee calculations (example: 2% platform + 0.5% transaction)
    const platformFee = investmentAmount * 0.02;
    const transactionFee = investmentAmount * 0.005;
    const totalFees = platformFee + transactionFee;
    const netInvestment = investmentAmount - totalFees;

    // Return calculations (example: 8% annual)
    const annualReturn = 0.08;
    const monthlyReturn = (netInvestment * annualReturn) / 12;
    const yearlyReturn = netInvestment * annualReturn;
    const totalReturn = yearlyReturn * 5; // 5-year projection

    // Dates
    const breakEvenMonths = Math.ceil(netInvestment / monthlyReturn);
    const breakEvenDate = new Date();
    breakEvenDate.setMonth(breakEvenDate.getMonth() + breakEvenMonths);

    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + 5);

    const result: InvestmentCalculation = {
      investmentAmount,
      tokensReceived,
      estimatedReturns: {
        monthly: monthlyReturn,
        yearly: yearlyReturn,
        total: totalReturn,
      },
      carbonCredits: co2Reduced,
      carbonImpact: {
        co2Reduced,
        treesEquivalent,
        carsOffRoad,
      },
      fees: {
        platform: platformFee,
        transaction: transactionFee,
        total: totalFees,
      },
      netInvestment,
      breakEvenDate: breakEvenDate.toISOString(),
      maturityDate: maturityDate.toISOString(),
    };

    setCalculation(result);
    if (onCalculate) {
      onCalculate(result);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmount(Math.max(0, numValue));
  };

  const presetAmounts = [500, 1000, 5000, 10000, 50000];

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yatırım Miktarı ($)
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min={project.investmentRange?.min || 100}
              max={project.investmentRange?.max || 1000000}
              step={100}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => calculateImpact(amount)}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calculator className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Amounts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                amount === preset
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
              }`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {calculation && (
        <div className="space-y-4">
          {/* Financial Impact */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Finansal Getiri
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Aylık</div>
                <div className="font-bold text-blue-700">
                  ${calculation.estimatedReturns.monthly.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Yıllık</div>
                <div className="font-bold text-blue-700">
                  ${calculation.estimatedReturns.yearly.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">5 Yıl Toplam</div>
                <div className="font-bold text-blue-700">
                  ${calculation.estimatedReturns.total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-600" />
              Çevresel Etki
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span>CO₂ Azaltımı</span>
                </div>
                <span className="font-bold text-green-700">
                  {calculation.carbonImpact.co2Reduced.toFixed(2)} ton/yıl
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <TreePine className="h-4 w-4 text-green-600" />
                  <span>Ağaç Eşdeğeri</span>
                </div>
                <span className="font-bold text-green-700">
                  {calculation.carbonImpact.treesEquivalent.toLocaleString()} ağaç
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Car className="h-4 w-4 text-green-600" />
                  <span>Araç Eşdeğeri</span>
                </div>
                <span className="font-bold text-green-700">
                  {calculation.carbonImpact.carsOffRoad} araç/yıl
                </span>
              </div>
            </div>
          </div>

          {/* Token & Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Token Alacağınız</div>
              <div className="text-2xl font-bold text-purple-700">
                {calculation.tokensReceived.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {project.tokenEconomics?.tokenSymbol || 'DCB'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Toplam Ücretler</div>
              <div className="text-2xl font-bold text-gray-700">
                ${calculation.fees.total.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Platform + İşlem Ücreti
              </div>
            </div>
          </div>

          {/* Key Dates */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600 mb-1">Başabaş Noktası</div>
                <div className="font-bold text-yellow-700">
                  {new Date(calculation.breakEvenDate).toLocaleDateString('tr-TR', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Vade Tarihi</div>
                <div className="font-bold text-yellow-700">
                  {new Date(calculation.maturityDate).toLocaleDateString('tr-TR', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
        <strong>Not:</strong> Bu hesaplamalar tahminidir ve gerçek getiriler değişiklik
        gösterebilir. Yatırım yapmadan önce projenin detaylı finansal raporlarını inceleyiniz.
      </div>
    </div>
  );
}
