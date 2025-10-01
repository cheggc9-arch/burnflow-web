import Header from '@/components/Header';

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
                <h1 className="text-4xl font-bold pump-gradient-text">ROADMAP</h1>
              </div>
              <p className="text-gray-400 text-lg">
                Future features and improvements coming to the RewardFlow ecosystem
              </p>
            </div>

            <div className="space-y-8">
              {/* Phase 1 */}
              <div className="border-l-4 border-green-400 pl-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-green-400">Phase 1: Foundation</h2>
                </div>
                <div className="space-y-3 ml-12">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span className="text-gray-300">Automated reward distribution system</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span className="text-gray-300">Weighted distribution algorithm</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span className="text-gray-300">Real-time holder tracking</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <span className="text-gray-300">Open source algorithm</span>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="border-l-4 border-blue-400 pl-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-blue-400">Phase 2: Token Launch Platform</h2>
                </div>
                <div className="space-y-3 ml-12">
                  <div className="flex items-center">
                    <span className="text-gray-300">🚀 Web App for Token Launches - Deploy your own reward system</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-300">🏗️ Custom Distribution Templates - Choose how fees are distributed</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-300">👥 Multi-Wallet Support - Distribute to specific team wallets</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-300">⚖️ Holder-Based Distribution - Like our current system</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-300">🔒 Trustless Fee Distribution - No single person controls fees</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-300">📊 Real-time Analytics Dashboard for each project</span>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="border-l-4 border-purple-400 pl-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-purple-400">Phase 3: Expansion</h2>
                </div>
                <div className="space-y-3 ml-12">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">Cross-chain compatibility</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">API for third-party integrations</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">Advanced analytics and reporting</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">Mobile app for platform management</span>
                  </div>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="border-l-4 border-yellow-400 pl-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    4
                  </div>
                  <h2 className="text-2xl font-bold text-yellow-400">Phase 4: Innovation</h2>
                </div>
                <div className="space-y-3 ml-12">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">AI-powered reward optimization</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">DeFi protocol integrations</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">NFT rewards and achievements</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">○</span>
                    <span className="text-gray-400">Community-driven features</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-600">
              <h3 className="text-xl font-bold text-green-400 mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-4">
                Follow our progress and get notified about new features as they're released.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/hold2earnsol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-400 hover:text-yellow-400 transition-colors font-mono text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="lucide lucide-x"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                  <span>Follow on X</span>
                </a>
                <a
                  href="https://github.com/your-username/hold2earn-algorithm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-400 hover:text-yellow-400 transition-colors font-mono text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-github"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
