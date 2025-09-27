import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function RewardCalculator() {
  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Reward Calculator</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">Estimate your potential rewards based on holding patterns</p>
          <Link href="/formula" className="formula-link">
            How it works <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Total Fees to Distribute (SOL)</label>
            <div className="relative">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                defaultValue="1"
              />
              <div className="mt-2 text-center text-[var(--pump-green)] font-bold">1.0 SOL</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Your Token Balance</label>
            <div className="relative">
              <input
                type="range"
                min="20000"
                max="10000000"
                step="1000"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                defaultValue="50000"
              />
              <div className="mt-2 text-center text-[var(--pump-green)] font-bold">50,000</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Hold Duration</label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="8760"
                step="1"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                defaultValue="72"
              />
              <div className="mt-2 text-center text-[var(--pump-green)] font-bold">3 days</div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-4 space-y-1">
          <p>* This is a simulation based on current holder data and assumptions.</p>
          <p>
            💡 <strong className="text-[var(--pump-green)]">Pro tip:</strong> Early holders (first 24 hours) get up to 3x multiplier! Every hour counts in the early adopter phase.
          </p>
        </div>
      </div>
    </div>
  );
}