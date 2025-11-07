import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalculatorModeSelector from './CalculatorModeSelector';
import CategoryInputs from './CategoryInputs';
import CalculationResults from './CalculationResults';
import ProjectRecommendations from './ProjectRecommendations';
import type { CalculatorMode } from './CalculatorModeSelector';
import type { CategoryData } from './CategoryInputs';

type Step = 'mode' | 'inputs' | 'results';

const AdvancedCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('mode');
  const [mode, setMode] = useState<CalculatorMode>('personal');
  const [categoryData, setCategoryData] = useState<CategoryData>({
    transportation: {
      carKm: 0,
      carType: 'gasoline',
      flightHours: 0,
      publicTransportKm: 0,
    },
    energy: {
      electricityKwh: 0,
      naturalGasM3: 0,
      heatingOil: 0,
    },
    food: {
      meatKg: 0,
      dairyKg: 0,
      localFood: 30,
    },
    waste: {
      recyclingRate: 20,
      compostRate: 10,
    },
    shopping: {
      clothingItems: 0,
      electronicsItems: 0,
      secondHandRate: 10,
    },
  });

  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
  };

  const handleDataChange = (newData: CategoryData) => {
    setCategoryData(newData);
  };

  const handleNextStep = () => {
    if (currentStep === 'mode') {
      setCurrentStep('inputs');
    } else if (currentStep === 'inputs') {
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'results') {
      setCurrentStep('inputs');
    } else if (currentStep === 'inputs') {
      setCurrentStep('mode');
    }
  };

  const handleReset = () => {
    setCurrentStep('mode');
    setMode('personal');
    setCategoryData({
      transportation: {
        carKm: 0,
        carType: 'gasoline',
        flightHours: 0,
        publicTransportKm: 0,
      },
      energy: {
        electricityKwh: 0,
        naturalGasM3: 0,
        heatingOil: 0,
      },
      food: {
        meatKg: 0,
        dairyKg: 0,
        localFood: 30,
      },
      waste: {
        recyclingRate: 20,
        compostRate: 10,
      },
      shopping: {
        clothingItems: 0,
        electronicsItems: 0,
        secondHandRate: 10,
      },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total emissions for ProjectRecommendations
  const calculateTotalEmissions = () => {
    // Simplified calculation - CalculationResults has the full logic
    // This is just for passing to ProjectRecommendations
    const carFactor = mode === 'personal' ? 0.192 * 12 : 0.192;
    const transportEmissions = categoryData.transportation.carKm * carFactor;
    const energyEmissions =
      categoryData.energy.electricityKwh * 0.475 * (mode === 'personal' ? 12 : 1);
    const foodEmissions = categoryData.food.meatKg * 27 * (mode === 'personal' ? 52 : 12);
    return transportEmissions + energyEmissions + foodEmissions;
  };

  const steps = [
    { id: 'mode', label: 'Mod Seçimi', icon: '⚙️' },
    { id: 'inputs', label: 'Veri Girişi', icon: '📝' },
    { id: 'results', label: 'Sonuçlar', icon: '📊' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🧮 Gelişmiş Karbon Hesaplayıcı
          </h1>
          <p className="text-lg text-gray-600">
            Detaylı karbon ayak izinizi hesaplayın ve offset için öneriler alın
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                      index <= currentStepIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    animate={{
                      scale: index === currentStepIndex ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4">
                    <div
                      className={`h-full rounded-full transition-all ${
                        index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm"
          >
            {currentStep === 'mode' && (
              <CalculatorModeSelector selectedMode={mode} onModeChange={handleModeChange} />
            )}

            {currentStep === 'inputs' && (
              <CategoryInputs mode={mode} data={categoryData} onChange={handleDataChange} />
            )}

            {currentStep === 'results' && (
              <div className="space-y-8">
                <CalculationResults mode={mode} data={categoryData} />
                <ProjectRecommendations totalEmissions={calculateTotalEmissions()} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={currentStep === 'results' ? handleReset : handlePrevStep}
            disabled={currentStep === 'mode'}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 'mode'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : currentStep === 'results'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {currentStep === 'results' ? '🔄 Yeni Hesaplama' : '← Geri'}
          </button>

          {currentStep !== 'results' && (
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
            >
              {currentStep === 'inputs' ? '📊 Hesapla' : 'İleri →'}
            </button>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Hesaplamalar <strong>IPCC 2023</strong> standartları ve{' '}
            <strong>Türkiye ortalama değerleri</strong> kullanılarak yapılmıştır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalculator;
