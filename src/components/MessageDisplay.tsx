'use client';

import { useEffect, useState } from 'react';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

export default function MessageDisplay({ message, type, onClose }: MessageDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  // Terminal prefix and colors based on message type
  const prefix = type === 'success' ? '[SUCCESS]' : '[ERROR]';
  const neonColor = type === 'success' ? 'text-green-400' : 'text-pink-400';
  const glowColor = type === 'success' ? 'shadow-green-400/50' : 'shadow-pink-400/50';
  const borderGlow = type === 'success' ? 'border-green-400/50' : 'border-pink-400/50';

  // Matrix rain characters for background effect
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  
  return (
    <>
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-10"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <div className="text-green-400 text-xs font-mono">
              {matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Message Container */}
      <div 
        className={`
          relative mb-4 overflow-hidden
          transform transition-all duration-500 ease-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          ${isExiting ? 'translate-x-full opacity-0 scale-95' : ''}
        `}
        role="alert"
      >
        {/* Holographic Background with Scanning Effect */}
        <div className="hologram neon-border rounded-lg p-4 relative backdrop-blur-sm">
          
          {/* Scanner Line Animation */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          
          {/* Circuit Pattern Overlay */}
          <div className="absolute inset-0 circuit-pattern opacity-20 rounded-lg"></div>
          
          {/* Content Container */}
          <div className="relative z-10 flex justify-between items-center">
            
            {/* Message Content with Glitch Effect */}
            <div className="flex items-center space-x-3 flex-1">
              
              {/* Terminal Prefix */}
              <span className={`
                font-bold font-mono text-sm ${neonColor} neon-text
                px-2 py-1 rounded border ${borderGlow}
                shadow-lg ${glowColor}
              `}>
                {prefix}
              </span>
              
              {/* Main Message with Glitch */}
              <span 
                className={`
                  glitch ${neonColor} font-medium
                  text-shadow-lg font-mono
                  ${type === 'error' ? 'animate-pulse' : ''}
                `}
                data-text={message}
              >
                {message}
              </span>
            </div>
            
            {/* Terminal Close Button */}
            <button
              onClick={handleClose}
              className={`
                ml-4 px-3 py-1 font-mono font-bold text-sm
                border rounded transition-all duration-200
                ${neonColor} ${borderGlow} neon-text
                hover:shadow-lg hover:${glowColor}
                hover:scale-110 hover:brightness-125
                relative overflow-hidden group
              `}
            >
              {/* Button Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-500"></div>
              
              {/* Button Text */}
              <span className="relative z-10">[X]</span>
            </button>
          </div>
          
          {/* Data Stream Effect */}
          <div className="absolute -bottom-2 left-0 w-full overflow-hidden opacity-30">
            <div className="font-mono text-xs text-cyan-400 whitespace-nowrap animate-pulse">
              {'> SYSTEM_ALERT_ACKNOWLEDGED :: TIMESTAMP_' + Date.now() + ' :: STATUS_ACTIVE'}
            </div>
          </div>
        </div>
        
        {/* Additional Glow Effects */}
        <div className={`
          absolute inset-0 rounded-lg blur-xl ${glowColor} 
          opacity-20 -z-10 animate-pulse
        `}></div>
      </div>
    </>
  );
}