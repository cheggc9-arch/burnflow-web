'use client';

import { useState } from 'react';

export default function BurnTrigger() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<string | null>(null);
  
  // Check if manual burn trigger should be shown
  const showManualTrigger = process.env.SHOW_MANUAL_BURN_TRIGGER === 'true';
  
  if (!showManualTrigger) {
    return null;
  }

  const handleTriggerBurn = async () => {
    setIsTriggering(true);
    
    try {
      const response = await fetch('/api/trigger-burn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLastTrigger(new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }) + ' UTC');
        alert('Burn triggered successfully!');
      } else {
        alert(`Failed to trigger burn: ${result.error}`);
      }
    } catch (error) {
      alert(`Error triggering burn: ${error}`);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="pump-card rounded-xl p-6 text-center">
      <div className="py-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">MANUAL BURN TRIGGER</h3>
          <p className="text-gray-400 text-sm">
            Manually trigger a burn operation (for testing purposes)
          </p>
          
          <button
            onClick={handleTriggerBurn}
            disabled={isTriggering}
            className={`px-6 py-3 rounded-lg font-mono text-sm font-semibold transition-all duration-200 ${
              isTriggering
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-400 text-black hover:transform hover:scale-105'
            }`}
          >
            {isTriggering ? 'TRIGGERING BURN...' : 'TRIGGER BURN'}
          </button>
          
          {lastTrigger && (
            <div className="text-xs text-gray-400">
              Last triggered: {lastTrigger}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            ⚠️ This will use the burn wallet's SOL to buy and burn tokens
          </div>
        </div>
      </div>
    </div>
  );
}
