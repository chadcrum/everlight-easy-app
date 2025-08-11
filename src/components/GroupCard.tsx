'use client';

import { useState } from 'react';
import { LightSequence } from '@/types/light';
import LightCard from './LightCard';

interface GroupCardProps {
  groupName: string;
  sequences: LightSequence[];
  selectedSequence: LightSequence | null;
  onSequenceSelect: (sequence: LightSequence) => void;
}

export default function GroupCard({ groupName, sequences, selectedSequence, onSequenceSelect }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-6">
      <div
        className="p-6 cyber-card neon-border cursor-pointer rounded-lg transition-all duration-300"
        onClick={handleToggleExpanded}
      >
        <div className="flex justify-between items-center">
          <h2 
            className="text-2xl font-bold neon-text"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {groupName}
          </h2>
          <div className="flex items-center space-x-3 text-cyan-400">
            <span className="text-xl font-mono">
              {isExpanded ? '◢◣' : '◤◥'}
            </span>
            <span className="neon-text text-sm font-mono bg-slate-900/50 px-2 py-1 rounded border border-cyan-500/30">
              [{sequences.length} UNITS]
            </span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 expanded-content p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4">
            {sequences.map((sequence, index) => (
              <LightCard
                key={`${groupName}-${sequence.alias}-${index}`}
                sequence={sequence}
                isSelected={selectedSequence === sequence}
                onSelect={() => onSequenceSelect(sequence)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}