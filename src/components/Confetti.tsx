import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  onComplete: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: 'circle' | 'star' | 'square';
  }>>([]);

  const [fireworks, setFireworks] = useState<Array<{
    id: number;
    x: number;
    y: number;
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      opacity: number;
      life: number;
    }>;
  }>>([]);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (show) {
      const colors = [
        '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
      ];
      
      const shapes = ['circle', 'star', 'square'];
      const newParticles = [];
      const newFireworks = [];
      
      // Create simple confetti particles
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 12 + 6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 6,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)] as any
        });
      }

      // Create 3 simple fireworks
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const firework = {
            id: Date.now() + i,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.3,
            particles: []
          };

          // Create explosion particles
          for (let j = 0; j < 20; j++) {
            const angle = (j / 20) * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            firework.particles.push({
              x: firework.x,
              y: firework.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: color,
              size: Math.random() * 6 + 3,
              opacity: 1,
              life: 1
            });
          }

          setFireworks(prev => [...prev, firework]);
        }, i * 800);
      }
      
      setParticles(newParticles);
      setShowMessage(true);
      
      // Clean up after 8 seconds
      const timer = setTimeout(() => {
        setParticles([]);
        setFireworks([]);
        setShowMessage(false);
        onComplete();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  useEffect(() => {
    if (particles.length === 0 && fireworks.length === 0) return;

    let animationId: number;
    
    const animate = () => {
      // Animate confetti particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          let newY = particle.y + particle.vy;
          let newX = particle.x + particle.vx;
          let newVy = particle.vy + 0.3; // gravity
          let newOpacity = particle.opacity;
          
          // Fade out when off screen
          if (newY > window.innerHeight + 50) {
            newOpacity = Math.max(0, particle.opacity - 0.02);
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            vy: newVy,
            rotation: particle.rotation + particle.rotationSpeed,
            opacity: newOpacity
          };
        }).filter(particle => particle.opacity > 0);
      });

      // Animate fireworks
      setFireworks(prevFireworks => {
        return prevFireworks.map(firework => {
          const updatedParticles = firework.particles.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // gravity
            vx: p.vx * 0.98, // air resistance
            opacity: p.opacity * 0.96,
            life: p.life * 0.96
          })).filter(p => p.life > 0.1);

          return {
            ...firework,
            particles: updatedParticles
          };
        }).filter(f => f.particles.length > 0);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particles, fireworks]);

  const renderShape = (particle: any) => {
    const baseStyle = {
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
      opacity: particle.opacity,
      boxShadow: `0 0 ${particle.size}px ${particle.color}60`
    };

    if (particle.shape === 'star') {
      return (
        <div key={particle.id} className="absolute" style={{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          transform: `rotate(${particle.rotation}deg)`,
          opacity: particle.opacity
        }}>
          <svg width={particle.size} height={particle.size} viewBox="0 0 24 24" fill={particle.color}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      );
    } else if (particle.shape === 'square') {
      return (
        <div
          key={particle.id}
          className="absolute"
          style={{...baseStyle, borderRadius: '2px'}}
        />
      );
    } else {
      return (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={baseStyle}
        />
      );
    }
  };

  if (!show || (particles.length === 0 && fireworks.length === 0)) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti particles */}
      {particles.map(particle => renderShape(particle))}
      
      {/* Fireworks */}
      {fireworks.map(firework => (
        <React.Fragment key={firework.id}>
          {firework.particles.map((particle, index) => (
            <div
              key={`${firework.id}-${index}`}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
              }}
            />
          ))}
        </React.Fragment>
      ))}
      
      {/* Success message */}
      {showMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mb-4">
            <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce">
              <div className="text-4xl">🎉</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-3xl md:text-4xl font-bold">
              SELAMAT!
            </div>
            <div className="text-white text-lg md:text-xl font-semibold">
              Proyek Berhasil Diselesaikan!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};