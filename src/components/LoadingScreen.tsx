import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Start fade out animation
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 500);
          }, 1500);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center transition-opacity duration-500 ${progress >= 100 ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Rotating Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-80 h-80 border-2 border-cyan-500/30 rounded-full animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-4 h-4 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-2 shadow-lg shadow-cyan-400/50"></div>
          </div>
          
          {/* Middle Ring */}
          <div className="absolute inset-8 border-2 border-purple-500/40 rounded-full animate-spin-reverse">
            <div className="absolute top-0 right-0 w-3 h-3 bg-purple-400 rounded-full transform translate-x-1 -translate-y-1 shadow-lg shadow-purple-400/50"></div>
          </div>
          
          {/* Inner Ring */}
          <div className="absolute inset-16 border-2 border-blue-500/50 rounded-full animate-spin-slow">
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1 translate-y-1 shadow-lg shadow-blue-400/50"></div>
          </div>
        </div>
      </div>

      {/* Central Logo/Icon */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hexagonal Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 relative">
            {/* Hexagon Shape */}
            <div className="absolute inset-0 transform rotate-0 animate-pulse">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,5 85,25 85,75 50,95 15,75 15,25"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Inner Code Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-cyan-400 text-2xl font-mono animate-bounce">
                &lt;/&gt;
              </div>
            </div>
            
            {/* Glowing Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-pulse">
            My Learning
          </h1>
          <p className="text-gray-300 text-lg animate-fade-in-out">
            My Coding Journey..
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-cyan-400 font-mono text-lg">
          {Math.round(progress)}%
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8">
        <div className="w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
      </div>
      <div className="absolute top-8 right-8">
        <div className="w-8 h-8 border-r-2 border-t-2 border-purple-400/50"></div>
      </div>
      <div className="absolute bottom-8 left-8">
        <div className="w-8 h-8 border-l-2 border-b-2 border-blue-400/50"></div>
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
      </div>
    </div>
  );
};