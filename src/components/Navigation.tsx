import React from 'react';
import { Palette, Code, Atom } from 'lucide-react';

interface NavigationProps {
  currentPage: 'php' | 'html-css' | 'react';
  onPageChange: (page: 'php' | 'html-css' | 'react') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-6 max-w-3xl mx-auto">
        <button
          onClick={() => onPageChange('php')}
          className={`
            flex items-center gap-4 px-8 py-5 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm border relative overflow-hidden group
            ${currentPage === 'php' 
              ? 'bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-white shadow-xl shadow-purple-500/20 border-purple-400/50 transform scale-105' 
              : 'text-gray-300 hover:text-white hover:bg-purple-500/10 hover:scale-105 border-purple-500/30 bg-white/5'
            }
          `}
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentPage === 'php' ? 'opacity-100' : ''}`}></div>
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke="currentColor" strokeWidth="2"/>
                <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">PHP</text>
              </svg>
              {currentPage === 'php' && (
                <div className="absolute -inset-2 bg-purple-400/20 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-lg font-semibold">PHP</span>
          </div>
        </button>
        
        <button
          onClick={() => onPageChange('html-css')}
          className={`
            flex items-center gap-4 px-8 py-5 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm border relative overflow-hidden group
            ${currentPage === 'html-css' 
              ? 'bg-gradient-to-r from-orange-500/20 to-red-600/20 text-white shadow-xl shadow-orange-500/20 border-orange-400/50 transform scale-105' 
              : 'text-gray-300 hover:text-white hover:bg-orange-500/10 hover:scale-105 border-orange-500/30 bg-white/5'
            }
          `}
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentPage === 'html-css' ? 'opacity-100' : ''}`}></div>
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <Palette className="w-7 h-7" />
              {currentPage === 'html-css' && (
                <div className="absolute -inset-2 bg-orange-400/20 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-lg font-semibold">HTML & CSS</span>
          </div>
        </button>
        
        <button
          onClick={() => onPageChange('react')}
          className={`
            flex items-center gap-4 px-8 py-5 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm border relative overflow-hidden group
            ${currentPage === 'react' 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white shadow-xl shadow-cyan-500/20 border-cyan-400/50 transform scale-105' 
              : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 hover:scale-105 border-cyan-500/30 bg-white/5'
            }
          `}
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentPage === 'react' ? 'opacity-100' : ''}`}></div>
          
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
                <ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-60 12 12)"/>
              </svg>
              {currentPage === 'react' && (
                <div className="absolute -inset-2 bg-cyan-400/20 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-lg font-semibold">React</span>
          </div>
        </button>
      </div>
    </div>
  );
};