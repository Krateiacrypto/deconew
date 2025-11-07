import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { CalculatorMode } from './CalculatorModeSelector';
import type { CategoryData } from './CategoryInputs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CalculationResultsProps {
  mode: CalculatorMode;
  data: CategoryData;
}

// CO2 emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  car: {
    gasoline: 0.192, // kg CO2 per km
    diesel: 0.171,
    hybrid: 0.109,
    electric: 0.047,
  },
  flight: 90, // kg CO2 per hour
  publicTransport: 0.041, // kg CO2 per km
  electricity: 0.475, // kg CO2 per kWh (Turkey average)
  naturalGas: 2.0, // kg CO2 per m³
  heatingOil: 2.68, // kg CO2 per liter
  meat: 27, // kg CO2 per kg
  dairy: 8.5, // kg CO2 per kg
  clothing: 22, // kg CO2 per item
  electronics: 150, // kg CO2 per item
};

const CalculationResults: React.FC<CalculationResultsProps> = ({ mode, data }) => {
  // Calculate emissions for each category
  const calculateTransportation = () => {
    const carFactor = EMISSION_FACTORS.car[data.transportation.carType];
    const carEmissions = data.transportation.carKm * carFactor * (mode === 'personal' ? 12 : 1); // Monthly to yearly for personal
    const flightEmissions = data.transportation.flightHours * EMISSION_FACTORS.flight;
    const publicTransportEmissions = data.transportation.publicTransportKm * EMISSION_FACTORS.publicTransport * (mode === 'personal' ? 12 : 252); // Monthly to yearly for personal, daily to yearly for business
    return carEmissions + flightEmissions + publicTransportEmissions;
  };

  const calculateEnergy = () => {
    const electricityEmissions = data.energy.electricityKwh * EMISSION_FACTORS.electricity * (mode === 'personal' ? 12 : 1);
    const gasEmissions = data.energy.naturalGasM3 * EMISSION_FACTORS.naturalGas * (mode === 'personal' ? 12 : 1);
    const oilEmissions = data.energy.heatingOil * EMISSION_FACTORS.heatingOil;
    return electricityEmissions + gasEmissions + oilEmissions;
  };

  const calculateFood = () => {
    const meatEmissions = data.food.meatKg * EMISSION_FACTORS.meat * (mode === 'personal' ? 52 : 12); // Weekly to yearly for personal, monthly stays monthly for business
    const dairyEmissions = data.food.dairyKg * EMISSION_FACTORS.dairy * (mode === 'personal' ? 52 : 12);
    const localFoodReduction = (meatEmissions + dairyEmissions) * (data.food.localFood / 100) * 0.3; // 30% reduction for local food
    return meatEmissions + dairyEmissions - localFoodReduction;
  };

  const calculateWaste = () => {
    // Base waste emission (average person/company produces ~500kg waste per year)
    const baseWaste = mode === 'personal' ? 500 : 5000;
    const wasteEmissions = baseWaste * 0.5; // 0.5 kg CO2 per kg waste
    const recyclingReduction = wasteEmissions * (data.waste.recyclingRate / 100) * 0.6; // 60% reduction
    const compostReduction = wasteEmissions * (data.waste.compostRate / 100) * 0.4; // 40% reduction
    return wasteEmissions - recyclingReduction - compostReduction;
  };

  const calculateShopping = () => {
    const clothingEmissions = data.shopping.clothingItems * EMISSION_FACTORS.clothing;
    const electronicsEmissions = data.shopping.electronicsItems * EMISSION_FACTORS.electronics;
    const secondHandReduction = (clothingEmissions + electronicsEmissions) * (data.shopping.secondHandRate / 100) * 0.7; // 70% reduction
    return clothingEmissions + electronicsEmissions - secondHandReduction;
  };

  const transportationEmissions = calculateTransportation();
  const energyEmissions = calculateEnergy();
  const foodEmissions = calculateFood();
  const wasteEmissions = calculateWaste();
  const shoppingEmissions = calculateShopping();

  const totalEmissions = transportationEmissions + energyEmissions + foodEmissions + wasteEmissions + shoppingEmissions;

  // Average emissions (tons CO2 per year)
  const averageEmissions = mode === 'personal' ? 6.5 : 45; // Turkey average: 6.5 tons personal, 45 tons for small business

  // Calculate equivalents
  const equivalentTrees = Math.round((totalEmissions / 1000) * 50); // 1 ton CO2 = ~50 trees
  const equivalentCars = Math.round((totalEmissions / 1000) / 4.6 * 12); // Average car emits 4.6 tons/year, so months of driving
  const equivalentFlights = Math.round((totalEmissions / 1000) / 0.255); // Economy class passenger = 0.255 tons per 1000km

  // Chart data
  const chartData = {
    labels: ['Ulaşım', 'Enerji', 'Gıda', 'Atık', 'Alışveriş'],
    datasets: [
      {
        label: 'CO₂ Emisyonu (kg)',
        data: [
          transportationEmissions,
          energyEmissions,
          foodEmissions,
          wasteEmissions,
          shoppingEmissions,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(251, 146, 60, 0.8)', // orange
          'rgba(34, 197, 94, 0.8)', // green
          'rgba(168, 85, 247, 0.8)', // purple
          'rgba(236, 72, 153, 0.8)', // pink
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(251, 146, 60)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y.toFixed(2)} kg CO₂`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value + ' kg';
          },
        },
      },
    },
  };

  const comparisonPercentage = ((totalEmissions / 1000 / averageEmissions) * 100).toFixed(0);
  const isBelowAverage = totalEmissions / 1000 < averageEmissions;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Hesaplama Sonuçları</h2>
      <p className="text-gray-600 mb-6">
        {mode === 'personal' ? 'Yıllık' : 'Toplam'} karbon ayak iziniz ve detaylı analiz
      </p>

      {/* Total Emissions Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="text-center">
          <p className="text-lg mb-2 opacity-90">Toplam Karbon Ayak İzi</p>
          <div className="text-6xl font-bold mb-2">
            <CountUp end={totalEmissions / 1000} decimals={2} duration={2} />
          </div>
          <p className="text-xl">ton CO₂ / yıl</p>
        </div>

        {/* Comparison with average */}
        <div className="mt-6 pt-6 border-t border-green-400">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">
              {mode === 'personal' ? 'Türkiye Ortalaması' : 'Sektör Ortalaması'}
            </span>
            <span className="text-sm font-semibold">{averageEmissions} ton/yıl</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {isBelowAverage ? (
              <span className="text-sm">✅ Ortalamanın %{100 - Number(comparisonPercentage)}' altındasınız</span>
            ) : (
              <span className="text-sm">⚠️ Ortalamanın %{Number(comparisonPercentage) - 100} üstündesiniz</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Bazlı Dağılım</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Equivalents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl mb-2">🌳</div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            <CountUp end={equivalentTrees} duration={2} />
          </div>
          <p className="text-sm text-blue-700">ağaç dikmeniz gerekiyor</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="text-3xl mb-2">🚗</div>
          <div className="text-2xl font-bold text-orange-900 mb-1">
            <CountUp end={equivalentCars} duration={2} />
          </div>
          <p className="text-sm text-orange-700">ay araba kullanımına eşit</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl mb-2">✈️</div>
          <div className="text-2xl font-bold text-purple-900 mb-1">
            <CountUp end={equivalentFlights} duration={2} />
          </div>
          <p className="text-sm text-purple-700">km uçuş mesafesine eşit</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span> Azaltma Önerileri
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {transportationEmissions > 1000 && (
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">→</span>
              <span>Toplu taşıma kullanımını artırarak ulaşım emisyonunuzu %30 azaltabilirsiniz</span>
            </li>
          )}
          {energyEmissions > 1000 && (
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">→</span>
              <span>LED ampul ve A++ enerji sınıfı cihazlar ile enerji tüketiminizi %25 düşürebilirsiniz</span>
            </li>
          )}
          {foodEmissions > 1000 && (
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">→</span>
              <span>Haftalık et tüketiminizi 1 gün azaltarak yıllık 300kg CO₂ tasarruf edebilirsiniz</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CalculationResults;
