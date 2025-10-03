import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EarlyAdopterAdvantage() {
  return (
    <div className="pump-card rounded-xl p-6 bg-gradient-to-r from-green-900/20 via-blue-900/20 to-green-900/20 border-green-500/30">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
          <span className="text-2xl">⚡</span>
          <span>Early Adopter Advantage</span>
        </h3>
      </div>
      <div className="">
        <div className="space-y-6">
          {/* First Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-900/30 to-transparent rounded-lg p-4 border border-yellow-500/20">
              <div className="text-yellow-400 font-bold text-lg mb-1">🔥 MASSIVE Early Bonuses</div>
              <div className="text-gray-300 text-sm">First buyers get exponential rewards that decay over time. Every hour you wait, your potential earnings drop!</div>
            </div>
            <div className="bg-gradient-to-r from-blue-900/30 to-transparent rounded-lg p-4 border border-blue-500/20">
              <div className="text-blue-400 font-bold text-lg mb-1">💰 Beat the Whales</div>
              <div className="text-gray-300 text-sm">Small early positions can outearn massive late positions. Timing beats size in the first 24 hours!</div>
            </div>
          </div>
          
          {/* Second Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-transparent rounded-lg p-4 border border-purple-500/20">
              <div className="text-purple-400 font-bold text-lg mb-1">🚀 Compound Rewards</div>
              <div className="text-gray-300 text-sm">The longer you hold, the more you earn. Start early to maximize your tenure bonuses!</div>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--pump-green)] font-bold">✓</span>
                <span>Minimum 20,000 tokens to qualify for rewards</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[var(--pump-green)] font-bold">✓</span>
                <span>Real-time weightage calculation every 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[var(--pump-green)] font-bold">✓</span>
                <span>Fair distribution - no single factor dominates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[var(--pump-green)] font-bold">✓</span>
                <span>Transparent leaderboard shows your ranking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}