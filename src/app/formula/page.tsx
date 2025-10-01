import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

export default function FormulaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="pump-card rounded-xl p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <a href="/">
                  <button className="font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-white border border-gray-500 hover:border-[var(--pump-green)] hover:text-[var(--pump-green)] px-3 py-1.5 text-sm mr-6 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-left inline w-4 h-4 mr-2"
                      aria-hidden="true"
                    >
                      <path d="m12 19-7-7 7-7"></path>
                      <path d="M19 12H5"></path>
                    </svg>
                    Back
                  </button>
                </a>
                <h1 className="text-4xl font-bold pump-gradient-text">REWARD DISTRIBUTION FORMULA</h1>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-12">
              {/* Introduction */}
              <div className="text-center mb-12">
                <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  This token is built on Pump.fun, but it uses a custom reward distribution script. 
                  All creator rewards collected in the treasury are distributed fairly using a formula 
                  that rewards not only on token balance, but also on how early you've joined and how long you've held.
                </p>
              </div>

              {/* Why Not Just Balance */}
              <div className="pump-card p-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">WHY NOT JUST REWARD BY TOKEN BALANCE?</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  If we gave out rewards purely based on token balance, the largest wallets would always dominate. 
                  Instead, this formula ensures rankings are not the same as "who has the most coins." 
                  Smaller, earlier believers get a real edge.
                </p>
              </div>

              {/* The 3 Ingredients */}
              <div>
                <h3 className="text-3xl font-bold text-green-400 text-center mb-8">THE 3 INGREDIENTS OF WEIGHT</h3>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Balance Weight */}
                  <div className="pump-card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-pink-300 text-black rounded-full flex items-center justify-center font-bold text-sm mr-3">1</div>
                      <h4 className="text-xl font-bold text-pink-300">TOKEN BALANCE WEIGHT</h4>
                    </div>
                    <p className="text-gray-300 mb-4">We reward bigger holders, but with diminishing returns so whales don't overwhelm the system:</p>
                    <div className="bg-black/50 p-4 rounded border border-green-500/30 mb-4 overflow-x-auto">
                      <code className="text-green-400 text-sm whitespace-nowrap">token_balance_weight = 1 + log10(token_balance / 20,000)</code>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• 20k tokens = 1.0</div>
                      <div>• 200k tokens ≈ 2.0</div>
                      <div>• 2M tokens ≈ 3.0</div>
                    </div>
                    <p className="text-yellow-400 text-sm mt-4">👉 You get more weight for more tokens, but each step up gives less of an advantage.</p>
                  </div>

                  {/* Earlyness Bonus */}
                  <div className="pump-card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-3">2</div>
                      <h4 className="text-xl font-bold text-cyan-400">EARLYNESS BONUS</h4>
                    </div>
                    <p className="text-gray-300 mb-4">The closer you buy to launch, the stronger your multiplier:</p>
                    <div className="bg-black/50 p-4 rounded border border-cyan-500/30 mb-4 overflow-x-auto">
                      <code className="text-cyan-400 text-sm whitespace-nowrap">early_bonus = 1 + 2 × exp(-days_since_launch / 2)</code>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• At launch: ~3.0× boost</div>
                      <div>• 2 days late: ~1.7× boost</div>
                      <div>• 1 week late: ~1.1× boost</div>
                    </div>
                    <p className="text-yellow-400 text-sm mt-4">👉 Early buyers lock in a powerful head start.</p>
                  </div>

                  {/* Tenure Bonus */}
                  <div className="pump-card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-3">3</div>
                      <h4 className="text-xl font-bold text-purple-400">TENURE BONUS</h4>
                    </div>
                    <p className="text-gray-300 mb-4">The longer you hold, the more your weight grows, but with diminishing returns:</p>
                    <div className="bg-black/50 p-4 rounded border border-purple-500/30 mb-4 overflow-x-auto">
                      <code className="text-purple-400 text-sm whitespace-nowrap">tenure_bonus = 1 + 0.6 × log2(days_held + 1)</code>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• 1 day: 1.6×</div>
                      <div>• 30 days: ~4.0×</div>
                      <div>• 90 days: ~5.0×</div>
                    </div>
                    <p className="text-yellow-400 text-sm mt-4">👉 Hold longer = steadily grow your multiplier.</p>
                  </div>
                </div>
              </div>

              {/* Total Weight & Rewards */}
              <div className="pump-card p-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">TOTAL WEIGHT & REWARDS</h3>
                <div className="space-y-4">
                  <div className="bg-black/50 p-4 rounded border border-green-500/30">
                    <code className="text-green-400 text-sm">time_weight = early_bonus × tenure_bonus</code>
                  </div>
                  <div className="bg-black/50 p-4 rounded border border-green-500/30">
                    <code className="text-green-400 text-sm">total_weight = token_balance_weight × time_weight</code>
                  </div>
                  <div className="bg-black/50 p-4 rounded border border-yellow-500/30">
                    <code className="text-yellow-400 text-sm font-bold">reward = (your_weight / total_weights_all) × total_rewards</code>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mt-6">
                  This ensures that early, loyal holders with even modest token balances can outrank late whales.
                </p>
              </div>

              {/* Example */}
              <div className="pump-card p-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">EXAMPLE</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded">
                    <h4 className="text-pink-400 font-bold mb-2">Wallet A</h4>
                    <p className="text-gray-300 text-sm">20k tokens, bought day 1, held for 1 day</p>
                    <p className="text-pink-400 font-bold">Total weight ≈ 4.8</p>
                  </div>
                  <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded">
                    <h4 className="text-cyan-400 font-bold mb-2">Wallet B</h4>
                    <p className="text-gray-300 text-sm">200k tokens, bought day 2, held for 1 day</p>
                    <p className="text-cyan-400 font-bold">Total weight ≈ 7.6</p>
                  </div>
                  <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded">
                    <h4 className="text-purple-400 font-bold mb-2">Wallet C</h4>
                    <p className="text-gray-300 text-sm">20k tokens, bought day 7, held for 1 day</p>
                    <p className="text-purple-400 font-bold">Total weight ≈ 1.7</p>
                  </div>
                </div>
                <p className="text-yellow-400 text-lg mt-6">
                  👉 Timing and loyalty change the outcome. It's not just about raw token balance.
                </p>
              </div>

              {/* Strategy */}
              <div className="text-center pump-card p-8">
                <h3 className="text-2xl font-bold text-green-400 mb-4">STRATEGY</h3>
                <p className="text-gray-300 text-lg mb-4">
                  Every hour you wait, your earlyness bonus shrinks. Every day you don't hold, 
                  your tenure bonus doesn't grow. If you want the maximum share of creator rewards, 
                  the best move is simple:
                </p>
                <div className="text-2xl font-bold text-yellow-400">
                  Buy early. Hold long. Get rewarded.
                </div>
              </div>

              {/* Why This Formula Works */}
              <div>
                <h3 className="text-3xl font-bold text-green-400 text-center mb-8">WHY THIS FORMULA WORKS</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="pump-card p-6">
                    <h4 className="text-xl font-bold text-yellow-400 mb-4">🔥 MASSIVE EARLY ADOPTER REWARDS</h4>
                    <p className="text-gray-300">
                      First-hour holders get 3x multiplier! Hour-based tracking means every minute counts 
                      in the crucial early phases, rewarding true believers and early supporters.
                    </p>
                  </div>
                  
                  <div className="pump-card p-6">
                    <h4 className="text-xl font-bold text-cyan-400 mb-4">⚡ SMART PHASE TRANSITIONS</h4>
                    <p className="text-gray-300">
                      Four distinct phases ensure optimal rewards at every stage: early adopter bonuses, 
                      growth incentives, sustained holding rewards, and long-term loyalty benefits.
                    </p>
                  </div>
                  
                  <div className="pump-card p-6">
                    <h4 className="text-xl font-bold text-purple-400 mb-4">🛡️ BALANCED WHALE PROTECTION</h4>
                    <p className="text-gray-300">
                      Logarithmic token balance scaling prevents whale dominance while still rewarding larger 
                      commitments. Early timing beats big bags in the initial phases!
                    </p>
                  </div>
                  
                  <div className="pump-card p-6">
                    <h4 className="text-xl font-bold text-pink-300 mb-4">📈 CATCH-UP MECHANISMS</h4>
                    <p className="text-gray-300">
                      Later holders can still build significant weight through sustained holding, 
                      ensuring the community stays engaged and rewards remain meaningful for all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}