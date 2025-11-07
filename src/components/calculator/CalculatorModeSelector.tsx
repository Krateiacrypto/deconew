import React from 'react';
import { motion } from 'framer-motion';

export type CalculatorMode = 'personal' | 'business';

interface CalculatorModeSelectorProps {
  selectedMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

const CalculatorModeSelector: React.FC<CalculatorModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'personal' as CalculatorMode,
      title: 'Kişisel Hesaplama',
      description: 'Bireysel karbon ayak izinizi hesaplayın',
      icon: '👤',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500',
    },
    {
      id: 'business' as CalculatorMode,
      title: 'İşletme Hesaplama',
      description: 'Şirket karbon ayak izini hesaplayın',
      icon: '🏢',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Hesaplama Modu</h2>
      <p className="text-gray-600 mb-6">
        Hangi tür hesaplama yapmak istediğinizi seçin
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? `${mode.borderColor} bg-white shadow-lg`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-mode"
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl"
                  style={{ zIndex: -1 }}
                />
              )}

              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{mode.icon}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mode.title}
              </h3>
              <p className="text-sm text-gray-600">{mode.description}</p>

              {/* Gradient bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${mode.color} rounded-b-xl transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CalculatorModeSelector;
