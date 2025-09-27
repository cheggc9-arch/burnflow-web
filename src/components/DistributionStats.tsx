import { Coins } from "lucide-react";

export default function DistributionStats() {
  return (
    <div className="pump-card rounded-xl p-6">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <Coins className="w-6 h-6 text-[var(--pump-green)]" />
          <span>Distribution Statistics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-[var(--pump-green)]">0.0000 SOL</div>
            <div className="text-sm text-gray-400">Total Distributed</div>
            <div className="text-xs text-gray-500 mt-1">Across all rounds</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-[var(--pump-blue)]">0</div>
            <div className="text-sm text-gray-400">Distribution Rounds</div>
            <div className="text-xs text-gray-500 mt-1">Completed distributions</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="text-3xl font-bold text-[var(--pump-green)]">0</div>
            <div className="text-sm text-gray-400">Unique Recipients</div>
            <div className="text-xs text-gray-500 mt-1">Different wallets rewarded</div>
          </div>
        </div>
      </div>
    </div>
  );
}
