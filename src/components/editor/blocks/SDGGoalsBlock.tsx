import React, { useState } from 'react';
import { Block } from '../../../types/editor';

interface SDGGoalsBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

const SDG_GOALS = [
  { id: 1, name: 'Yoksulluğa Son', color: '#e5243b', icon: '🏠' },
  { id: 2, name: 'Açlığa Son', color: '#dda63a', icon: '🌾' },
  { id: 3, name: 'Sağlıklı Yaşam', color: '#4c9f38', icon: '❤️' },
  { id: 4, name: 'Nitelikli Eğitim', color: '#c5192d', icon: '📚' },
  { id: 5, name: 'Toplumsal Cinsiyet Eşitliği', color: '#ff3a21', icon: '⚖️' },
  { id: 6, name: 'Temiz Su ve Sanitasyon', color: '#26bde2', icon: '💧' },
  { id: 7, name: 'Erişilebilir ve Temiz Enerji', color: '#fcc30b', icon: '⚡' },
  { id: 8, name: 'İnsana Yakışır İş ve Ekonomik Büyüme', color: '#a21942', icon: '💼' },
  { id: 9, name: 'Sanayi, Yenilikçilik ve Altyapı', color: '#fd6925', icon: '🏭' },
  { id: 10, name: 'Eşitsizliklerin Azaltılması', color: '#dd1367', icon: '📊' },
  { id: 11, name: 'Sürdürülebilir Şehirler ve Topluluklar', color: '#fd9d24', icon: '🏙️' },
  { id: 12, name: 'Sorumlu Tüketim ve Üretim', color: '#bf8b2e', icon: '♻️' },
  { id: 13, name: 'İklim Eylemi', color: '#3f7e44', icon: '🌍' },
  { id: 14, name: 'Sudaki Yaşam', color: '#0a97d9', icon: '🐟' },
  { id: 15, name: 'Karasal Yaşam', color: '#56c02b', icon: '🌳' },
  { id: 16, name: 'Barış, Adalet ve Güçlü Kurumlar', color: '#00689d', icon: '⚖️' },
  { id: 17, name: 'Amaçlar için Ortaklıklar', color: '#19486a', icon: '🤝' }
];

export const SDGGoalsBlock: React.FC<SDGGoalsBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<number[]>(block.content.sdgGoals || []);

  const handleGoalToggle = (goalId: number) => {
    const updated = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(updated);
    onContentChange({ sdgGoals: updated });
  };

  const style: React.CSSProperties = {
    padding: block.style.padding || '2rem',
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor || '#f0fdf4',
    borderRadius: block.style.borderRadius || '1rem',
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width || '100%',
    textAlign: block.style.textAlign || 'center'
  };

  return (
    <div style={style}>
      <h3 
        className="text-2xl font-bold text-gray-900 mb-6 cursor-pointer hover:text-emerald-600 transition-colors"
        onDoubleClick={() => !isPreview && setIsEditing(true)}
      >
        {block.content.text || 'Sürdürülebilir Kalkınma Hedeflerimiz'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {SDG_GOALS.filter(goal => selectedGoals.includes(goal.id)).map(goal => (
          <div
            key={goal.id}
            className="relative group cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => !isPreview && handleGoalToggle(goal.id)}
          >
            <div
              className="w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ backgroundColor: goal.color }}
            >
              {goal.icon}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors"></div>
            <p className="text-xs text-center mt-2 font-medium text-gray-700">
              {goal.id}. {goal.name}
            </p>
          </div>
        ))}
      </div>

      {!isPreview && (
        <div className="mt-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isEditing ? 'Seçimi Tamamla' : 'Hedefleri Düzenle'}
          </button>
          
          {isEditing && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Gösterilecek SDG hedeflerini seçin:</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                {SDG_GOALS.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-2 rounded text-xs transition-colors ${
                      selectedGoals.includes(goal.id)
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    } border`}
                  >
                    {goal.icon} {goal.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};