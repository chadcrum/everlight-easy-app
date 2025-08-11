'use client';

import { LightSequence } from '@/types/light';

interface LightCardProps {
  sequence: LightSequence;
  isSelected: boolean;
  onSelect: () => void;
}

export default function LightCard({ sequence, isSelected, onSelect }: LightCardProps) {
  return (
    <div
      className={`
        relative p-6 rounded-lg cursor-pointer transition-all duration-300 
        hologram circuit-pattern neon-border overflow-hidden
        ${isSelected 
          ? 'cyberpunk-selected animate-pulse' 
          : 'hover:scale-105'
        }
      `}
      onClick={onSelect}
      style={{
        background: isSelected 
          ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 0, 128, 0.2) 50%, rgba(0, 255, 255, 0.2) 100%)'
          : undefined,
        boxShadow: isSelected
          ? '0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 50px rgba(255, 0, 128, 0.4), 0 0 100px rgba(0, 255, 255, 0.3)'
          : undefined
      }}
    >
      {/* Scanning Line Effect */}
      <div 
        className="absolute top-0 left-0 w-full h-1 overflow-hidden"
      >
        <div 
          className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            animation: isSelected 
              ? 'scan 1s infinite linear' 
              : 'scan 3s infinite linear'
          }}
        />
      </div>
      
      {/* Digital Matrix Background */}
      <div className="absolute inset-0 opacity-20 cyberpunk-grid" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 
          className={`
            text-xl font-bold font-mono tracking-wider uppercase
            ${isSelected ? 'neon-text glitch text-pink-400' : 'neon-text text-cyan-400'}
          `}
          data-text={sequence.alias || 'Light Pattern'}
          style={{
            fontFamily: 'Orbitron, monospace',
            textShadow: isSelected 
              ? '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080, 0 0 40px #ff0080'
              : '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff'
          }}
        >
          {sequence.alias || 'Light Pattern'}
        </h3>
        
        {isSelected && (
          <div className="mt-4 relative">
            <div 
              className="text-sm font-mono uppercase tracking-widest neon-text text-green-400"
              style={{
                textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14',
                animation: 'neon-flicker 1s infinite alternate'
              }}
            >
              [[ SELECTED ]]
            </div>
            <div className="text-xs font-mono text-cyan-300 mt-1 opacity-60">
              SYSTEM_ACTIVE
            </div>
          </div>
        )}
        
        {/* Data Stream Effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400" />
    </div>
  );
}