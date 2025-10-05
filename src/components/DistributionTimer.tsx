'use client';

export default function DistributionTimer() {
  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Distribution Status</h3>
        <div className="text-sm text-yellow-400 font-semibold mt-2">
          🧪 TESTING MODE - Manual Distribution Only
        </div>
      </div>
      <div className="text-center">
        <div className="text-6xl mb-4">⏸️</div>
        <div className="text-2xl font-bold text-gray-300 mb-2">
          Timer Disabled
        </div>
        <div className="text-lg text-gray-400 mb-4">
          Automatic distributions are disabled for testing
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-yellow-400 font-semibold text-sm mb-2">
            Manual Distribution Available
          </div>
          <div className="text-gray-300 text-sm">
            Use the "Trigger Distribution Now" button below to manually test the distribution system.
          </div>
        </div>
      </div>
    </div>
  );
}