import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, CircleCheckBig, TrendingUp, Calculator } from "lucide-react";
import Link from "next/link";

export default function FormulaPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className="font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-white border border-gray-500 hover:border-[var(--pump-green)] hover:text-[var(--pump-green)] px-3 py-1.5 text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </Link>
            <h1 className="text-2xl font-bold pump-gradient-text">Reward Formula</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-bold pump-gradient-text">Transparent Reward Distribution</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our reward system is completely transparent and verifiable. Learn exactly how your rewards are calculated.
          </p>
        </div>
        <div className="space-y-6">
          <div className="pump-card rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
                <div className="w-8 h-8 pump-gradient rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <span>Smart Phase-Based Time Weight</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg text-sm space-y-2">
                <div><strong className="text-[var(--pump-green)]">Early Adopter (0-24h):</strong> 3x-1.5x multiplier by hour</div>
                <div><strong className="text-[var(--pump-blue)]">Growth Phase (1-7d):</strong> 12 points per day</div>
                <div><strong className="text-white">Sustained Phase (7-30d):</strong> 6 points per day</div>
                <div><strong className="text-gray-400">Loyalty Phase (30d+):</strong> √(days) × 15 scaling</div>
              </div>
              <p className="text-gray-300">
                Our smart system heavily rewards early adopters with hour-based tracking and massive multipliers, while still allowing later holders to build meaningful weight over time.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-gray-800/30 rounded">
                  <div className="text-xl font-bold text-[var(--pump-green)]">54</div>
                  <div className="text-xs text-gray-400">1 hour held</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded">
                  <div className="text-xl font-bold text-[var(--pump-green)]">36</div>
                  <div className="text-xs text-gray-400">24 hours held</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded">
                  <div className="text-xl font-bold text-[var(--pump-blue)]">126</div>
                  <div className="text-xs text-gray-400">7 days held</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded">
                  <div className="text-xl font-bold text-white">264</div>
                  <div className="text-xs text-gray-400">30 days held</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pump-card rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
                <div className="w-8 h-8 pump-gradient rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <span>Balance Weight Calculation</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-6 rounded-lg font-mono text-lg">
                balance_weight = log₁₀(token_balance / min_balance + 1)
              </div>
              <p className="text-gray-300">
                Your balance weight uses a logarithmic scale based on your token holdings relative to the minimum required balance (20,000 tokens). This prevents whale dominance while still rewarding larger holders proportionally.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-gray-800/30 rounded">
                  <div className="text-2xl font-bold text-[var(--pump-blue)]">1.0</div>
                  <div className="text-sm text-gray-400">20K tokens</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded">
                  <div className="text-2xl font-bold text-[var(--pump-blue)]">1.7</div>
                  <div className="text-sm text-gray-400">100K tokens</div>
                </div>
                <div className="text-center p-4 bg-gray-800/30 rounded">
                  <div className="text-2xl font-bold text-[var(--pump-blue)]">2.0</div>
                  <div className="text-sm text-gray-400">200K tokens</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pump-card rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
                <div className="w-8 h-8 pump-gradient rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <span>Combined Weight</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-6 rounded-lg font-mono text-lg">
                total_weight = time_weight × balance_weight
              </div>
              <p className="text-gray-300">
                Your total weight is the product of your time weight and balance weight. This combined metric represents your overall contribution to the token ecosystem through both commitment and investment.
              </p>
            </div>
          </div>

          <div className="pump-card rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
                <div className="w-8 h-8 pump-gradient rounded-full flex items-center justify-center text-black font-bold">
                  4
                </div>
                <span>Reward Distribution</span>
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-6 rounded-lg font-mono text-lg">
                your_reward = (your_weight / total_all_weights) × total_fees
              </div>
              <p className="text-gray-300">
                Your final reward is your proportional share of the total creator fees collected. This ensures fair distribution based on your relative contribution compared to all other eligible holders.
              </p>
            </div>
          </div>
        </div>

        <div className="pump-card rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold pump-gradient-text flex items-center space-x-3">
              <CircleCheckBig className="w-6 h-6 text-[var(--pump-green)]" />
              <span>Why This Formula Works</span>
            </h3>
          </div>
          <div className="">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[var(--pump-green)]" />
                  <span>Massive Early Adopter Rewards</span>
                </h4>
                <p className="text-gray-300 text-sm">
                  First-hour holders get 3x multiplier! Hour-based tracking means every minute counts in the crucial early phases, rewarding true believers and early supporters.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-[var(--pump-blue)]" />
                  <span>Smart Phase Transitions</span>
                </h4>
                <p className="text-gray-300 text-sm">
                  Four distinct phases ensure optimal rewards at every stage: early adopter bonuses, growth incentives, sustained holding rewards, and long-term loyalty benefits.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center space-x-2">
                  <CircleCheckBig className="w-5 h-5 text-[var(--pump-green)]" />
                  <span>Balanced Whale Protection</span>
                </h4>
                <p className="text-gray-300 text-sm">
                  Logarithmic balance scaling prevents whale dominance while still rewarding larger commitments. Early timing beats big bags in the initial phases!
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[var(--pump-blue)]" />
                  <span>Catch-Up Mechanisms</span>
                </h4>
                <p className="text-gray-300 text-sm">
                  Later holders can still build significant weight through sustained holding, ensuring the community stays engaged and rewards remain meaningful for all.
            </p>
          </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
