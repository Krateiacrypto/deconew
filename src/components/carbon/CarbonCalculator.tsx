/**
 * Carbon Calculator Component
 * Calculate carbon credits using backend API
 * Standalone tool for estimating CO2 reduction and tokens
 */

import React, { useState } from 'react';
import { Calculator, Leaf, Coins, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import {
  calculateCarbonCredits,
  getMethodologies,
  CarbonCalculationInput,
  CarbonCalculationResult,
  Methodology,
  formatCO2,
  calculateReductionPercentage,
} from '../../services/api/carbonApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

export default function CarbonCalculator() {
  // Form state
  const [baselineEmissions, setBaselineEmissions] = useState<number>(1000);
  const [projectEmissions, setProjectEmissions] = useState<number>(300);
  const [lifetimeYears, setLifetimeYears] = useState<number>(10);
  const [methodology, setMethodology] = useState<string>('VCS');
  const [leakageFactor, setLeakageFactor] = useState<number>(0);
  const [uncertaintyFactor, setUncertaintyFactor] = useState<number>(0);
  const [bufferFactor, setBufferFactor] = useState<number>(0.1);
  const [tokenExchangeRate, setTokenExchangeRate] = useState<number>(1);

  // Results state
  const [result, setResult] = useState<CarbonCalculationResult | null>(null);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);

  // Async operations
  const {
    execute: calculate,
    loading: calculating,
    error: calculateError,
  } = useAsyncOperation(
    async () => {
      const input: CarbonCalculationInput = {
        baseline_emissions: baselineEmissions,
        project_emissions: projectEmissions,
        project_lifetime_years: lifetimeYears,
        leakage_factor: leakageFactor,
        uncertainty_factor: uncertaintyFactor,
        buffer_factor: bufferFactor,
        token_exchange_rate: tokenExchangeRate,
        methodology,
      };

      const response = await calculateCarbonCredits(input);
      if (response.success && response.data) {
        setResult(response.data.calculation);
      }
    },
    { onError: (error) => console.error('Calculation failed:', error) }
  );

  const {
    execute: loadMethodologies,
    loading: loadingMethodologies,
  } = useAsyncOperation(
    async () => {
      const response = await getMethodologies();
      if (response.success && response.data) {
        setMethodologies(response.data.methodologies);
      }
    },
    { executeOnMount: true }
  );

  // Handle methodology change and update buffer
  const handleMethodologyChange = (code: string) => {
    setMethodology(code);
    const selected = methodologies.find((m) => m.code === code);
    if (selected) {
      setBufferFactor(selected.typical_buffer);
    }
  };

  // Handle calculate button
  const handleCalculate = () => {
    calculate();
  };

  // Quick preset buttons
  const presets = [
    { label: 'Small Project', baseline: 500, project: 150, years: 5 },
    { label: 'Medium Project', baseline: 1000, project: 300, years: 10 },
    { label: 'Large Project', baseline: 5000, project: 1000, years: 15 },
    { label: 'Enterprise', baseline: 10000, project: 2000, years: 20 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setBaselineEmissions(preset.baseline);
    setProjectEmissions(preset.project);
    setLifetimeYears(preset.years);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-green-600" />
          Carbon Credit Calculator
        </h1>
        <p className="text-gray-600">
          Estimate carbon credits and tokens for your sustainability project
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Inputs */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Parameters</h3>

            {/* Baseline Emissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Baseline Emissions (tons CO₂/year)
              </label>
              <input
                type="number"
                value={baselineEmissions}
                onChange={(e) => setBaselineEmissions(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="100"
              />
            </div>

            {/* Project Emissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Emissions (tons CO₂/year)
              </label>
              <input
                type="number"
                value={projectEmissions}
                onChange={(e) => setProjectEmissions(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="100"
              />
            </div>

            {/* Lifetime Years */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Lifetime (years)
              </label>
              <input
                type="number"
                value={lifetimeYears}
                onChange={(e) => setLifetimeYears(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="50"
              />
            </div>

            {/* Methodology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbon Credit Methodology
              </label>
              <select
                value={methodology}
                onChange={(e) => handleMethodologyChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loadingMethodologies}
              >
                {methodologies.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} (Buffer: {(m.typical_buffer * 100).toFixed(0)}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          <details className="bg-white rounded-lg border border-gray-200 p-6">
            <summary className="cursor-pointer font-semibold text-gray-900 mb-4">
              Advanced Options
            </summary>
            <div className="space-y-4">
              {/* Leakage Factor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leakage Factor (%)
                </label>
                <input
                  type="number"
                  value={leakageFactor}
                  onChange={(e) => setLeakageFactor(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              {/* Uncertainty Factor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Uncertainty Factor (%)
                </label>
                <input
                  type="number"
                  value={uncertaintyFactor}
                  onChange={(e) => setUncertaintyFactor(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              {/* Buffer Factor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buffer Pool Factor (%)
                </label>
                <input
                  type="number"
                  value={bufferFactor * 100}
                  onChange={(e) => setBufferFactor((parseFloat(e.target.value) || 0) / 100)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  max="50"
                  step="1"
                />
              </div>

              {/* Token Exchange Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Exchange Rate (tokens per ton CO₂)
                </label>
                <input
                  type="number"
                  value={tokenExchangeRate}
                  onChange={(e) => setTokenExchangeRate(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>
          </details>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {calculating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calculate Carbon Credits
              </>
            )}
          </button>

          {/* Error Display */}
          {calculateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Calculation Error</p>
                <p className="text-sm text-red-600">{calculateError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Calculation Results</h3>
                </div>

                <div className="space-y-4">
                  {/* Annual Reduction */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Annual Reduction</span>
                    <span className="text-lg font-bold text-green-700">
                      {formatCO2(result.results.annual_reduction)}
                    </span>
                  </div>

                  {/* Total Reduction */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Reduction ({lifetimeYears} years)</span>
                    <span className="text-lg font-bold text-green-700">
                      {formatCO2(result.results.total_reduction)}
                    </span>
                  </div>

                  {/* Reduction Percentage */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Reduction Percentage</span>
                    <span className="text-lg font-bold text-green-700">
                      {result.results.reduction_percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Adjustments & Deductions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Leakage Deduction</span>
                    <span className="font-medium text-gray-900">
                      -{formatCO2(result.results.adjustments.leakage)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Uncertainty Deduction</span>
                    <span className="font-medium text-gray-900">
                      -{formatCO2(result.results.adjustments.uncertainty)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Buffer Pool</span>
                    <span className="font-medium text-gray-900">
                      -{formatCO2(result.results.adjustments.buffer)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Adjustments</span>
                      <span className="font-bold text-red-600">
                        -{formatCO2(result.results.adjustments.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Results */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-blue-600" />
                  Net Carbon Credits
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Net CO₂ Reduction</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {formatCO2(result.results.net_reduction)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Carbon Tokens</span>
                    <span className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                      <Coins className="w-6 h-6" />
                      {result.results.total_tokens.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 bg-white/50 rounded p-2 mt-4">
                    Exchange Rate: {tokenExchangeRate} token(s) per ton CO₂
                  </div>
                </div>
              </div>

              {/* Methodology Info */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Methodology:</span> {methodology}
                  {methodologies.find((m) => m.code === methodology)?.documentation_url && (
                    <>
                      {' • '}
                      <a
                        href={methodologies.find((m) => m.code === methodology)?.documentation_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Documentation
                      </a>
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No Results Yet</p>
              <p className="text-sm text-gray-500">
                Enter your project parameters and click "Calculate" to see carbon credit estimates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
