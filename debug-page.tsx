'use client';

import { useState, useEffect } from 'react';
import { LightSequence } from '@/types/light';

export default function Debug() {
  const [data, setData] = useState<LightSequence[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Debug component mounted');
    
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/sequences');
        console.log('Response received:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data parsed:', result.length, 'items');
        setData(result);
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>Debug Page</h1>
      <p>Data length: {data ? data.length : 'null'}</p>
      {data && (
        <div>
          <h2>First item:</h2>
          <pre>{JSON.stringify(data[0], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}