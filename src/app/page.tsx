'use client';

import { useState, useEffect } from 'react';
import { LightSequence } from '@/types/light';
import GroupCard from '@/components/GroupCard';
import MessageDisplay from '@/components/MessageDisplay';

export default function Home() {
  const [sequences, setSequences] = useState<LightSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSequence, setSelectedSequence] = useState<LightSequence | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [turningOff, setTurningOff] = useState(false);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const response = await fetch('/api/sequences');
        const data = await response.json();
        setSequences(data);
      } catch (error) {
        console.error('Error fetching sequences:', error);
        setMessage('Failed to load sequences');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchSequences();
  }, []);

  // Group sequences by their groups field
  const groupedSequences = sequences.reduce((acc, sequence) => {
    if (sequence.groups && sequence.groups.length > 0) {
      sequence.groups.forEach(group => {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(sequence);
      });
    } else {
      // Handle sequences without groups
      if (!acc['Ungrouped']) {
        acc['Ungrouped'] = [];
      }
      acc['Ungrouped'].push(sequence);
    }
    return acc;
  }, {} as Record<string, LightSequence[]>);



  const handleSequenceSelect = async (sequence: LightSequence) => {
    setSelectedSequence(sequence);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pattern: sequence.pattern,
          colorMode: sequence.colorMode,
          effects: sequence.effects
        }),
      });

      if (response.ok) {
        setMessage(`Applied: ${sequence.alias || 'Light Pattern'}`);
        setMessageType('success');
      } else {
        throw new Error('Failed to apply sequence');
      }
    } catch (error) {
      console.error('Error applying sequence:', error);
      setMessage('Failed to apply sequence');
      setMessageType('error');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTurnOff = async () => {
    setTurningOff(true);
    
    try {
      const response = await fetch('/api/turn-off', {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Lights turned off');
        setMessageType('success');
        setSelectedSequence(null);
      } else {
        throw new Error('Failed to turn off lights');
      }
    } catch (error) {
      console.error('Error turning off lights:', error);
      setMessage('Failed to turn off lights');
      setMessageType('error');
    } finally {
      setTurningOff(false);
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen cyberpunk-grid relative overflow-hidden">
        {/* Background Effects */}
        <div className="matrix-rain">
          <div className="matrix-column">0101010\n1010101\n0101010</div>
          <div className="matrix-column">1100110\n0011001\n1100110</div>
          <div className="matrix-column">1010101\n0101010\n1010101</div>
        </div>
        <div className="scan-lines"></div>
        <div className="horizontal-scanner"></div>
        <div className="vertical-scanner"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 digital-noise">
            <div className="relative">
              <h1 
                className="text-6xl font-bold neon-text terminal-brackets glitch cyberpunk-grid mb-4"
                data-text="EVERLIGHT CONTROL"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                EVERLIGHT CONTROL
              </h1>
              <div className="scanning-line"></div>
            </div>
            
            <div className="cyber-spinner mx-auto mb-4"></div>
            
            <div className="text-xl font-mono neon-text text-cyan-400">
              <span className="terminal-text">INITIALIZING SYSTEMS</span>
              <span className="terminal-cursor block"></span>
            </div>
            
            <div className="text-sm font-mono text-cyan-300 opacity-60">
              LOADING LIGHT SEQUENCES...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyberpunk-grid relative overflow-hidden">
      {/* Background Effects */}
      <div className="matrix-rain">
        <div className="matrix-column">0101010\n1010101\n0101010</div>
        <div className="matrix-column">1100110\n0011001\n1100110</div>
        <div className="matrix-column">1010101\n0101010\n1010101</div>
        <div className="matrix-column">0011001\n1100110\n0011001</div>
        <div className="matrix-column">1111000\n0000111\n1111000</div>
      </div>
      <div className="scan-lines"></div>
      <div className="horizontal-scanner"></div>
      <div className="vertical-scanner"></div>
      <div className="static-overlay"></div>
      
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 digital-noise">
            <div className="flex items-center justify-center relative mb-6">
              <h1 
                className="text-6xl font-bold neon-text terminal-brackets glitch cyberpunk-grid"
                data-text="EVERLIGHT CONTROL"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                EVERLIGHT CONTROL
              </h1>
              
              {/* Turn Off Button - Right of title */}
              <button
                onClick={handleTurnOff}
                disabled={turningOff}
                className="ml-8 cyber-card bg-red-900/30 border-red-400 hover:bg-red-800/40 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 font-mono text-red-300 hover:text-red-200 neon-text transition-all duration-300 text-lg font-bold"
                style={{
                  textShadow: '0 0 10px #ff4444, 0 0 20px #ff4444, 0 0 30px #ff4444'
                }}
              >
                {turningOff ? 'TURNING OFF...' : 'TURN OFF'}
              </button>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-mono neon-text text-cyan-400 mb-2">
                [SYSTEM STATUS: ONLINE]
              </div>
              
              <div className="text-sm font-mono text-cyan-300 opacity-60">
                {sequences.length} LIGHT SEQUENCES DETECTED | {Object.keys(groupedSequences).length} GROUPS ACTIVE
              </div>
              
              <div className="scanning-line"></div>
            </div>
          </div>


          {/* Message Display */}
          {message && (
            <MessageDisplay message={message} type={messageType} />
          )}
          
          {/* Groups Display */}
          <div className="space-y-8">
            {Object.entries(groupedSequences).map(([groupName, groupSequences]) => (
              <GroupCard
                key={groupName}
                groupName={groupName.replace('EverLights/', '').replace('/', '')}
                sequences={groupSequences}
                selectedSequence={selectedSequence}
                onSequenceSelect={handleSequenceSelect}
              />
            ))}
          </div>
          
          {Object.keys(groupedSequences).length === 0 && (
            <div className="text-center mt-16">
              <div className="text-xl font-mono neon-text text-red-400 mb-2">
                [ERROR: NO SEQUENCES FOUND]
              </div>
              <div className="text-sm font-mono text-red-300 opacity-60">
                SYSTEM UNABLE TO DETECT LIGHT PATTERNS
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}