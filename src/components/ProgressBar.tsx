import React from 'react';
import { Trophy, Target, Zap } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  stageProgress: { [key: number]: { completed: number; total: number } };
  currentPage: 'php' | 'html-css' | 'react';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, stageProgress, currentPage }) => {
  const percentage = (completed / total) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-emerald-400 to-green-500';
    if (percentage >= 60) return 'from-cyan-400 to-blue-500';
    if (percentage >= 40) return 'from-amber-400 to-orange-500';
    if (percentage >= 20) return 'from-rose-400 to-pink-500';
    return 'from-purple-400 to-indigo-500';
  };

  const getMotivationalMessage = (percentage: number) => {
    if (percentage >= 90) return "🚀 Almost there! You're a master!";
    if (percentage >= 70) return "⚡ Amazing progress! Keep going!";
    if (percentage >= 50) return "🔥 Halfway there! You're doing great!";
    if (percentage >= 25) return "💪 Great start! Momentum is building!";
    return "🌟 Begin your coding journey!";
  };

  const getPageColors = () => {
    return {
      accent: 'slate-100',
      border: 'slate-600/30',
      cardBg: 'bg-slate-800/40',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
    };
  };

  const colors = getPageColors();

  return (
    <div className={`rounded-2xl p-6 border border-${colors.border} backdrop-blur-sm ${colors.cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
            <Trophy className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className={`${colors.textPrimary} font-semibold text-xl`}>Overall Progress</h3>
            <p className={colors.textSecondary}>{getMotivationalMessage(percentage)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${colors.textPrimary}`}>{completed}/{total}</div>
          <div className={colors.textMuted}>{percentage.toFixed(1)}%</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="relative h-5 bg-slate-700/50 rounded-full overflow-hidden mb-8 border border-slate-600/30">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(percentage)} rounded-full transition-all duration-700 shadow-lg`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
        </div>
      </div>

      {/* Tahapan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stageProgress).map(([stageNum, progress]) => {
          const stagePercentage = (progress.completed / progress.total) * 100;
          const stageNames = {
            php: {
              1: 'Logika Dasar',
              2: 'Form & Validasi',
              3: 'CRUD & Database',
              4: 'Mini Web App'
            },
            'html-css': {
              1: 'Dasar',
              2: 'Menengah',
              3: 'Lanjut',
              4: 'Mahir'
            },
            react: {
              1: 'Komponen Dasar',
              2: 'State Lanjutan',
              3: 'Routing & API',
              4: 'Mini Project'
            }
          };

          const currentStageNames = stageNames[currentPage];

          return (
            <div key={stageNum} className="bg-slate-800/30 rounded-xl p-4 border border-slate-600/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/30">
                  <Target size={14} className="text-slate-300" />
                </div>
                <h4 className={`${colors.textPrimary} font-medium`}>Tahap {stageNum}</h4>
              </div>
              <p className={`${colors.textMuted} text-sm mb-3`}>{currentStageNames[stageNum as keyof typeof currentStageNames]}</p>
              <div className={`flex justify-between items-center text-sm ${colors.textSecondary} mb-2`}>
                <span className="font-semibold">{progress.completed}/{progress.total}</span>
                <span className={colors.textMuted}>{stagePercentage.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
                <div
                  className={`h-full bg-gradient-to-r ${getProgressColor(stagePercentage)} rounded-full transition-all duration-500 shadow-md`}
                  style={{ width: `${stagePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        {percentage >= 25 && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30">
            <Zap size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Beginner</span>
          </div>
        )}
        {percentage >= 50 && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30">
            <Zap size={16} className="text-cyan-400" />
            <span className="text-sm font-medium">Intermediate</span>
          </div>
        )}
        {percentage >= 75 && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/50 text-slate-200 rounded-full border border-slate-600/30">
            <Zap size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">Advanced</span>
          </div>
        )}
        {percentage >= 90 && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-sm font-medium">Master</span>
          </div>
        )}
      </div>
    </div>
  );
};