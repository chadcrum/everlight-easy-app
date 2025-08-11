'use client';

import { useState, useEffect } from 'react';
import GroupCard from '@/components/GroupCard';
import MessageDisplay from '@/components/MessageDisplay';
import { LightSequence } from '@/types/light';

const TERMINAL_MESSAGES = [
  'INITIALIZING EVERLIGHT CONTROL MATRIX...',
  'ESTABLISHING NEURAL LINK...',
  'SCANNING LIGHT SEQUENCES...',
  'DECRYPTING PHOTON PATTERNS...',
  'CALIBRATING NEON FREQUENCIES...',
  'SYSTEM READY - WELCOME TO THE GRID'
];

export default function Home() {
  const [sequences, setSequences] = useState<LightSequence[]>([]);
  const [selectedSequence, setSelectedSequence] = useState<LightSequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [showInterface, setShowInterface] = useState(false);

  useEffect(() => {
    // Terminal boot sequence
    const terminalInterval = setInterval(() => {
      setTerminalStep(prev => {
        if (prev < TERMINAL_MESSAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(terminalInterval);
          setTimeout(() => {
            setShowInterface(true);
            fetchSequences();
          }, 1000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(terminalInterval);
  }, []);

  const fetchSequences = async () => {
    try {
      const response = await fetch('/api/sequences');
      if (!response.ok) {
        throw new Error('Failed to fetch sequences');
      }
      const data = await response.json();
      
      // Handle both single object and array responses
      const sequenceArray = Array.isArray(data) ? data : [data];
      
      // Add default alias and groups if missing
      const processedSequences = sequenceArray.map((seq, index) => ({
        ...seq,
        alias: seq.alias || `Light Pattern ${index + 1}`,
        groups: seq.groups && seq.groups.length > 0 ? seq.groups : ['Default']
      }));
      
      setSequences(processedSequences);
    } catch (error) {
      setMessage({ text: 'Failed to load light sequences', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSequenceSelect = async (sequence: LightSequence) => {
    setSelectedSequence(sequence);
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sequence),
      });

      if (!response.ok) {
        throw new Error('Failed to submit pattern');
      }

      setMessage({ text: `Light pattern "${sequence.alias || 'Light Pattern'}" applied successfully!`, type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to apply light pattern', type: 'error' });
      setSelectedSequence(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Group sequences by their groups
  const groupedSequences = sequences.reduce((acc, sequence) => {
    const groups = sequence.groups || ['Default'];
    groups.forEach(group => {
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(sequence);
    });
    return acc;
  }, {} as Record<string, LightSequence[]>);

  if (loading || !showInterface) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 cyberpunk-grid relative overflow-hidden">
        {/* Digital rain background */}
        <div className="digital-rain"></div>
        
        {/* Data stream */}
        <div className="data-stream"></div>
        
        {/* Scanning line */}
        <div className="scanning-line"></div>
        
        {/* Terminal loading interface */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="terminal-loading p-8 rounded-lg max-w-2xl w-full relative overflow-hidden">
            {/* Holographic effect */}
            <div className="hologram absolute inset-0 rounded-lg"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-neon-cyan font-mono mb-2">
                  EVERLIGHT CONTROL SYSTEM v2.77
                </h1>
                <div className="text-neon-green text-sm font-mono">
                  [CLASSIFIED] - NEURAL INTERFACE ACTIVE
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                {TERMINAL_MESSAGES.slice(0, terminalStep + 1).map((msg, index) => (
                  <div key={index} className="terminal-text font-mono text-sm flex items-center">
                    <span className="text-neon-cyan mr-2">&gt;</span>
                    <span className={index === terminalStep ? 'text-neon-green' : 'text-gray-400'}>
                      {msg}
                    </span>
                    {index === terminalStep && (
                      <span className="ml-2 animate-pulse text-neon-cyan">▌</span>
                    )}
                  </div>
                ))}
              </div>
              
              {terminalStep >= TERMINAL_MESSAGES.length - 1 && (
                <div className="text-center">
                  <div className="inline-block border-2 border-neon-cyan rounded px-4 py-2 animate-pulse">
                    <span className="text-neon-cyan font-mono">SYSTEM ONLINE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 cyberpunk-grid relative overflow-hidden">
      {/* Digital rain background */}
      <div className="digital-rain"></div>
      
      {/* Data stream */}
      <div className="data-stream"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 glitch neon-text" style={{fontFamily: 'Orbitron, sans-serif'}} data-text="EVERLIGHT CONTROL MATRIX">
          <span className="text-neon-cyan">EVERLIGHT</span>{' '}
          <span className="text-neon-pink">CONTROL</span>{' '}
          <span className="text-neon-cyan">MATRIX</span>
        </h1>

        {message && (
          <MessageDisplay
            message={message.text}
            type={message.type}
            onClose={() => setMessage(null)}
          />
        )}

        {sequences.length === 0 ? (
          <div className="text-center text-neon-cyan text-lg hologram p-8 rounded-lg" style={{fontFamily: 'Rajdhani, sans-serif'}}>
            <div className="neon-text">NO LIGHT SEQUENCES DETECTED</div>
            <div className="text-sm text-neon-green mt-2 font-mono">SCANNING FOR AVAILABLE NODES...</div>
          </div>
        ) : Object.keys(groupedSequences).length === 0 ? (
          <div className="text-center text-neon-cyan text-lg hologram p-8 rounded-lg" style={{fontFamily: 'Rajdhani, sans-serif'}}>
            <div className="neon-text">NO GROUPED SEQUENCES FOUND</div>
            <div className="text-sm text-neon-green mt-2 font-mono">INITIALIZING MATRIX PROTOCOLS...</div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {Object.entries(groupedSequences).map(([groupName, groupSequences]) => (
                <GroupCard
                  key={groupName}
                  groupName={groupName}
                  sequences={groupSequences}
                  selectedSequence={selectedSequence}
                  onSequenceSelect={handleSequenceSelect}
                />
              ))}
            </div>

            {/* Status Display */}
            <div className="text-center hologram p-6 rounded-lg">
              {submitting && (
                <div className="mb-4">
                  <div className="inline-flex items-center px-6 py-3 border border-neon-cyan rounded bg-black bg-opacity-50">
                    <span className="inline-block animate-spin mr-3 text-neon-cyan">⟲</span>
                    <span className="text-neon-cyan font-mono">EXECUTING PATTERN...</span>
                  </div>
                </div>
              )}
              
              {selectedSequence && !submitting && (
                <div className="p-4 border border-neon-green rounded bg-black bg-opacity-50">
                  <div className="text-neon-green font-mono text-sm mb-2">
                    ACTIVE SEQUENCE:
                  </div>
                  <div className="text-neon-cyan font-semibold text-lg" style={{fontFamily: 'Rajdhani, sans-serif'}}>
                    {selectedSequence.alias || 'Light Pattern'}
                  </div>
                  <div className="text-neon-green font-mono text-xs mt-2">
                    [ PATTERN APPLIED ]
                  </div>
                </div>
              )}
              
              {!selectedSequence && !submitting && (
                <div className="text-neon-cyan font-mono text-sm opacity-70">
                  SELECT A LIGHT SEQUENCE TO ACTIVATE
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}