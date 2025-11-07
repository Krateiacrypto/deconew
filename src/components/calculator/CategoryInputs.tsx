import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CalculatorMode } from './CalculatorModeSelector';

export interface CategoryData {
  transportation: {
    carKm: number;
    carType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    flightHours: number;
    publicTransportKm: number;
  };
  energy: {
    electricityKwh: number;
    naturalGasM3: number;
    heatingOil: number;
  };
  food: {
    meatKg: number;
    dairyKg: number;
    localFood: number; // percentage
  };
  waste: {
    recyclingRate: number; // percentage
    compostRate: number; // percentage
  };
  shopping: {
    clothingItems: number;
    electronicsItems: number;
    secondHandRate: number; // percentage
  };
}

interface CategoryInputsProps {
  mode: CalculatorMode;
  data: CategoryData;
  onChange: (data: CategoryData) => void;
}

const CategoryInputs: React.FC<CategoryInputsProps> = ({ mode, data, onChange }) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('transportation');

  const categories = [
    {
      id: 'transportation',
      title: '🚗 Ulaşım',
      description: mode === 'personal' ? 'Günlük ulaşım alışkanlıklarınız' : 'Şirket araç filosu ve iş seyahatleri',
    },
    {
      id: 'energy',
      title: '⚡ Enerji',
      description: mode === 'personal' ? 'Ev elektrik ve ısınma tüketiminiz' : 'Ofis ve tesis enerji kullanımı',
    },
    {
      id: 'food',
      title: '🍽️ Gıda',
      description: mode === 'personal' ? 'Beslenme alışkanlıklarınız' : 'Şirket kafeteryası ve yemek hizmetleri',
    },
    {
      id: 'waste',
      title: '♻️ Atık',
      description: mode === 'personal' ? 'Geri dönüşüm ve atık yönetiminiz' : 'Şirket atık yönetimi politikası',
    },
    {
      id: 'shopping',
      title: '🛍️ Alışveriş',
      description: mode === 'personal' ? 'Tüketim alışkanlıklarınız' : 'Şirket satın alma ve tedarik',
    },
  ];

  const updateData = (category: keyof CategoryData, field: string, value: number | string) => {
    onChange({
      ...data,
      [category]: {
        ...data[category],
        [field]: value,
      },
    });
  };

  const renderInputs = (categoryId: string) => {
    switch (categoryId) {
      case 'transportation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Araç Tipi
              </label>
              <select
                value={data.transportation.carType}
                onChange={(e) => updateData('transportation', 'carType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gasoline">Benzinli</option>
                <option value="diesel">Dizel</option>
                <option value="hybrid">Hibrit</option>
                <option value="electric">Elektrikli</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Aylık Araç Kullanımı (km)' : 'Yıllık Filo Kullanımı (km)'}
              </label>
              <input
                type="number"
                value={data.transportation.carKm}
                onChange={(e) => updateData('transportation', 'carKm', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Yıllık Uçuş Saati' : 'Yıllık İş Seyahati Saati'}
              </label>
              <input
                type="number"
                value={data.transportation.flightHours}
                onChange={(e) => updateData('transportation', 'flightHours', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Aylık Toplu Taşıma (km)' : 'Çalışan Servis Kullanımı (km/gün)'}
              </label>
              <input
                type="number"
                value={data.transportation.publicTransportKm}
                onChange={(e) => updateData('transportation', 'publicTransportKm', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        );

      case 'energy':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Aylık Elektrik Tüketimi (kWh)' : 'Yıllık Elektrik Tüketimi (kWh)'}
              </label>
              <input
                type="number"
                value={data.energy.electricityKwh}
                onChange={(e) => updateData('energy', 'electricityKwh', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Aylık Doğalgaz Tüketimi (m³)' : 'Yıllık Doğalgaz Tüketimi (m³)'}
              </label>
              <input
                type="number"
                value={data.energy.naturalGasM3}
                onChange={(e) => updateData('energy', 'naturalGasM3', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Yıllık Fuel Oil/LPG (Litre)' : 'Yıllık Fuel Oil Tüketimi (Litre)'}
              </label>
              <input
                type="number"
                value={data.energy.heatingOil}
                onChange={(e) => updateData('energy', 'heatingOil', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Haftalık Et Tüketimi (kg)' : 'Aylık Kafeterya Et Tüketimi (kg)'}
              </label>
              <input
                type="number"
                value={data.food.meatKg}
                onChange={(e) => updateData('food', 'meatKg', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Haftalık Süt Ürünleri (kg)' : 'Aylık Süt Ürünleri Tüketimi (kg)'}
              </label>
              <input
                type="number"
                value={data.food.dairyKg}
                onChange={(e) => updateData('food', 'dairyKg', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yerel/Organik Ürün Oranı (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={data.food.localFood}
                onChange={(e) => updateData('food', 'localFood', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {data.food.localFood}%
              </div>
            </div>
          </div>
        );

      case 'waste':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geri Dönüşüm Oranı (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={data.waste.recyclingRate}
                onChange={(e) => updateData('waste', 'recyclingRate', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {data.waste.recyclingRate}%
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kompost/Organik Atık Oranı (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={data.waste.compostRate}
                onChange={(e) => updateData('waste', 'compostRate', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {data.waste.compostRate}%
              </div>
            </div>
          </div>
        );

      case 'shopping':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Yıllık Yeni Kıyafet Sayısı' : 'Yıllık Kurumsal Kıyafet Alımı'}
              </label>
              <input
                type="number"
                value={data.shopping.clothingItems}
                onChange={(e) => updateData('shopping', 'clothingItems', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'personal' ? 'Yıllık Elektronik Ürün Alımı' : 'Yıllık IT Ekipman Alımı'}
              </label>
              <input
                type="number"
                value={data.shopping.electronicsItems}
                onChange={(e) => updateData('shopping', 'electronicsItems', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İkinci El/Yenilenmiş Ürün Oranı (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={data.shopping.secondHandRate}
                onChange={(e) => updateData('shopping', 'secondHandRate', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 mt-1">
                {data.shopping.secondHandRate}%
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Kategori Bilgileri</h2>
      <p className="text-gray-600 mb-6">
        Her kategori için bilgilerinizi girerek karbon ayak izinizi hesaplayın
      </p>

      {categories.map((category) => {
        const isExpanded = expandedCategory === category.id;
        return (
          <div
            key={category.id}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">{category.title.split(' ')[0]}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.title.split(' ').slice(1).join(' ')}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="px-6 py-4">{renderInputs(category.id)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryInputs;
