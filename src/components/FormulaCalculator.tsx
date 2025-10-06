"use client";

import { useState, useEffect } from "react";
import { Calculator, Clock, Coins, Users, TrendingUp } from "lucide-react";

interface CalculationResult {
  estimatedReward: number;
  sharePercentage: number;
  timeWeight: number;
  balanceWeight: number;
  totalWeight: number;
}

export default function FormulaCalculator() {
  const [totalFees, setTotalFees] = useState(1);
  const [userBalance, setUserBalance] = useState(parseInt(process.env.NEXT_PUBLIC_MIN_HOLDER_BALANCE || "1000000"));
  const [holdDuration, setHoldDuration] = useState(72);
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const minBalance = parseInt(process.env.NEXT_PUBLIC_MIN_HOLDER_BALANCE || "1000000");
    const timeWeight = holdDuration < 24 ? 3 : holdDuration < 168 ? 1.5 : 1;
    const balanceWeight = Math.log10(userBalance / minBalance + 1);
    const totalWeight = timeWeight * balanceWeight;
    const estimatedReward = (totalWeight / 100) * totalFees;
    const sharePercentage = (totalWeight / 100) * 100;

    setResult({
      estimatedReward,
      sharePercentage,
      timeWeight,
      balanceWeight,
      totalWeight
    });
  }, [totalFees, userBalance, holdDuration]);

  return (
    <div className="space-y-8">
      {/* Formula Explanation */}
      <div className="pump-card rounded-xl p-6">
        <h2 className="text-2xl font-bold pump-gradient-text mb-6 flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-[var(--pump-green)]" />
          <span>Reward Formula</span>
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--pump-green)] mb-2">
              Your Share = (Your Weight / Total Weight) × Total Fees
            </h3>
            <p className="text-gray-300 text-sm">
              Where your weight is calculated as: <strong>Balance × Time Multiplier</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Clock className="w-8 h-8 text-[var(--pump-blue)] mx-auto mb-2" />
              <h4 className="font-semibold text-white">Time Multiplier</h4>
              <p className="text-sm text-gray-400">
                First 24h: <span className="text-[var(--pump-green)] font-bold">3x</span><br/>
                First week: <span className="text-[var(--pump-blue)] font-bold">1.5x</span><br/>
                After week: <span className="text-white font-bold">1x</span>
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Coins className="w-8 h-8 text-[var(--pump-green)] mx-auto mb-2" />
              <h4 className="font-semibold text-white">Balance Weight</h4>
              <p className="text-sm text-gray-400">
                Logarithmic scaling<br/>
                <span className="text-xs">log₁₀(balance/{parseInt(process.env.NEXT_PUBLIC_MIN_HOLDER_BALANCE || "1000000")} + 1)</span>
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <Users className="w-8 h-8 text-[var(--pump-purple)] mx-auto mb-2" />
              <h4 className="font-semibold text-white">Total Weight</h4>
              <p className="text-sm text-gray-400">
                Sum of all holders&apos;<br/>
                weighted balances
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="pump-card rounded-xl p-6">
        <h2 className="text-2xl font-bold pump-gradient-text mb-6 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-[var(--pump-green)]" />
          <span>Interactive Calculator</span>
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Total Fees to Distribute (SOL)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={totalFees}
                  onChange={(e) => setTotalFees(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider pump-slider"
                />
                <div className="mt-2 text-center text-[var(--pump-green)] font-bold">
                  {totalFees.toFixed(1)} SOL
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Your Token Balance
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={parseInt(process.env.NEXT_PUBLIC_MIN_HOLDER_BALANCE || "1000000")}
                  max="10000000"
                  step="1000"
                  value={userBalance}
                  onChange={(e) => setUserBalance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider pump-slider"
                />
                <div className="mt-2 text-center text-[var(--pump-green)] font-bold">
                  {userBalance.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Hold Duration
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="8760"
                  step="1"
                  value={holdDuration}
                  onChange={(e) => setHoldDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider pump-slider"
                />
                <div className="mt-2 text-center text-[var(--pump-green)] font-bold">
                  {holdDuration < 24 
                    ? `${holdDuration} hours`
                    : holdDuration < 168 
                    ? `${Math.round(holdDuration / 24)} days`
                    : `${Math.round(holdDuration / 168)} weeks`
                  }
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold pump-gradient-text mb-4">
                Calculation Results
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--pump-green)]">
                    {result.estimatedReward.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-400">SOL Reward</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--pump-blue)]">
                    {result.sharePercentage.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">Share</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {result.timeWeight.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Time Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {result.balanceWeight.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Balance Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--pump-purple)]">
                    {result.totalWeight.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Total Weight</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <p>* This is a simulation based on current holder data and assumptions.</p>
            <p>
              💡 <strong className="text-[var(--pump-green)]">Pro tip:</strong> Early holders (first 24 hours) get up to 3x multiplier! Every hour counts in the early adopter phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
