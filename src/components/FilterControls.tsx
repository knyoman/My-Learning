import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedStage: number;
  onStageChange: (stage: number) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onReset: () => void;
  currentPage: 'php' | 'html-css' | 'react';
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedDifficulty,
  onDifficultyChange,
  onReset,
  currentPage
}) => {
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

  // Stage names berdasarkan halaman
  const getStageNames = () => {
    switch (currentPage) {
      case 'php':
        return {
          1: 'Logika Dasar',
          2: 'Form & Validasi',
          3: 'CRUD & Database',
          4: 'Mini Web App'
        };
      case 'html-css':
        return {
          1: 'Dasar',
          2: 'Menengah',
          3: 'Lanjut',
          4: 'Mahir'
        };
      case 'react':
        return {
          1: 'Komponen Dasar',
          2: 'State Lanjutan',
          3: 'Routing & API',
          4: 'Mini Project'
        };
    }
  };

  const stageNames = getStageNames();

  return (
    <div className={`rounded-2xl p-6 border border-${colors.border} backdrop-blur-sm ${colors.cardBg} hover:scale-[1.01] transition-all duration-300`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
          <Filter className="text-slate-300" size={24} />
        </div>
        <h3 className={`${colors.textPrimary} font-semibold text-xl`}>Filter & Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${colors.textMuted}`} size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-xl ${colors.textPrimary} placeholder-slate-400 focus:outline-none focus:border-slate-500/50 focus:bg-slate-700/70 transition-all backdrop-blur-sm shadow-sm`}
          />
        </div>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => onStageChange(Number(e.target.value))}
          className={`appearance-none w-full px-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-xl ${colors.textPrimary} focus:outline-none focus:border-slate-500/50 focus:bg-slate-700/70 transition-all backdrop-blur-sm shadow-sm`}
        >
          <option value={0} className="bg-slate-800 text-slate-100">All Stages</option>
          <option value={1} className="bg-slate-800 text-slate-100">Tahap 1 - {stageNames[1]}</option>
          <option value={2} className="bg-slate-800 text-slate-100">Tahap 2 - {stageNames[2]}</option>
          <option value={3} className="bg-slate-800 text-slate-100">Tahap 3 - {stageNames[3]}</option>
          <option value={4} className="bg-slate-800 text-slate-100">Tahap 4 - {stageNames[4]}</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className={`appearance-none w-full px-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-xl ${colors.textPrimary} focus:outline-none focus:border-slate-500/50 focus:bg-slate-700/70 transition-all backdrop-blur-sm shadow-sm`}
        >
          <option value="" className="bg-slate-800 text-slate-100">All Difficulties</option>
          <option value="easy" className="bg-slate-800 text-slate-100">Easy</option>
          <option value="medium" className="bg-slate-800 text-slate-100">Medium</option>
          <option value="hard" className="bg-slate-800 text-slate-100">Hard</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className={`flex items-center justify-center gap-3 px-4 py-4 bg-slate-700/50 ${colors.textSecondary} rounded-xl hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all duration-300 hover:scale-105 font-medium backdrop-blur-sm border border-slate-600/30 shadow-sm`}
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || selectedStage > 0 || selectedDifficulty) && (
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <span className={`${colors.textMuted} font-medium`}>Active filters:</span>
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedStage > 0 && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30">
              Stage: {selectedStage}
            </span>
          )}
          {selectedDifficulty && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
              Difficulty: {selectedDifficulty}
            </span>
          )}
        </div>
      )}
    </div>
  );
};