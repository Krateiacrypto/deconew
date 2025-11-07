import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface AllocationData {
  projectName: string;
  amount: number;
  percentage: number;
  color?: string;
}

interface AssetAllocationChartProps {
  data: AllocationData[];
  title?: string;
}

const COLORS = [
  'rgb(34, 197, 94)', // green-500
  'rgb(59, 130, 246)', // blue-500
  'rgb(168, 85, 247)', // purple-500
  'rgb(251, 146, 60)', // orange-400
  'rgb(236, 72, 153)', // pink-500
  'rgb(14, 165, 233)', // sky-500
  'rgb(139, 92, 246)', // violet-500
  'rgb(245, 158, 11)', // amber-500
];

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  data,
  title = 'Varlık Dağılımı',
}) => {
  const chartData = {
    labels: data.map((d) => d.projectName),
    datasets: [
      {
        label: 'Yatırım Tutarı',
        data: data.map((d) => d.amount),
        backgroundColor: data.map((d, i) => d.color || COLORS[i % COLORS.length]),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          generateLabels: function (chart: any) {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => {
              const value = datasets[0].data[i];
              const percentage = data[i].percentage;
              return {
                text: `${label} (${percentage.toFixed(1)}%)`,
                fillStyle: datasets[0].backgroundColor[i],
                hidden: false,
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = data[context.dataIndex].percentage;
            return [
              `${label}`,
              `Tutar: ${new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(value)}`,
              `Oran: ${percentage.toFixed(2)}%`,
            ];
          },
        },
      },
    },
    cutout: '65%', // Doughnut chart için
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Yatırımlarınızın projelere göre dağılımı
        </p>
      </div>

      {/* Chart */}
      <div className="h-80 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Doughnut data={chartData} options={options} />
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-gray-500 mb-1">Toplam</p>
            <p className="text-2xl font-bold text-gray-900">
              ₺{totalAmount.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {/* Summary List */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm text-gray-700 font-medium">
                {item.projectName}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ₺{item.amount.toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Diversification Score */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Çeşitlendirme Skoru</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.length} farklı projeye yatırım yapılmış
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {Math.min(data.length * 10, 100)}
              </p>
              <p className="text-xs text-gray-500">/ 100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationChart;
