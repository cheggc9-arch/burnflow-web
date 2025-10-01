export default function HowItWorks() {
  return (
    <div id="how-it-works" className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">How It Works</h3>
        <p className="text-gray-400 text-sm mt-2">A sophisticated reward system that rewards early adopters, loyal holders, and fair distribution</p>
      </div>
      <div className="">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold text-lg text-[var(--pump-green)]">1. Buy & Hold</h3>
            <p className="text-gray-400 text-sm">Purchase tokens and hold them in your wallet.<br/>The earlier you buy, the more you earn!</p>
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/20">
              <div className="text-xs text-green-400 font-medium">Early Advantage</div>
              <div className="text-xs text-gray-300">Exponential rewards for early buyers</div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-lg text-[var(--pump-blue)]">2. Earn Weightage</h3>
            <p className="text-gray-400 text-sm">Your weightage is calculated using three factors:<br/>balance, earlyness, and loyalty bonuses.</p>
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-blue-400 font-medium">Weightage Formula</div>
              <div className="text-xs text-gray-300">Balance × Earlyness × Loyalty</div>
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lg text-yellow-400">3. Get Rewards</h3>
            <p className="text-gray-400 text-sm">Receive your proportional share of creator fees based on your weightage.<br/>Updated every 5 minutes!</p>
            <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/20">
              <div className="text-xs text-yellow-400 font-medium">Auto Distribution</div>
              <div className="text-xs text-gray-300">Every 20 minutes</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-600">
          <a
            href="/formula"
            className="inline-flex items-center space-x-2 text-green-300 hover:text-yellow-400 transition-colors font-mono text-base font-bold tracking-wider group"
          >
            <span>Learn more about the formula</span>
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
              className="group-hover:translate-x-1 transition-transform duration-200"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </a>
        </div>
        
      </div>
    </div>
  );
}