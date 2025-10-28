'use client';

export default function HowItWorks() {
  return (
    <div className="pump-card rounded-xl p-6" id="how-it-works">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold burn-gradient-text">HOW IT WORKS</h3>
      </div>
      
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-gray-200 font-bold text-sm border border-orange-600/30">
            1
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-3">Creator Fees Collection</h4>
            <p className="text-gray-200 text-base leading-relaxed">
              100% of creator fees are sent automatically to the burn wallet.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-gray-200 font-bold text-sm border border-orange-600/30">
            2
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-3">Token Purchase</h4>
            <p className="text-gray-200 text-base leading-relaxed">
              Creator fees in the burn wallet are automatically used to buy the BurnFlow token once the timer goes to zero.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-gray-200 font-bold text-sm border border-orange-600/30">
            3
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-3">Token Burning</h4>
            <p className="text-gray-200 text-base leading-relaxed">
              All the bought BurnFlow tokens are then automatically burned using Solana's SPL token burn instruction.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-gray-200 font-bold text-sm border border-orange-600/30">
            4
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-100 mb-3">Transparent Recording</h4>
            <p className="text-gray-200 text-base leading-relaxed">
              The burn details are updated automatically in the burn history with links to the buy transaction and burn transaction.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mt-8 pt-6 border-t border-gray-600">
        <h4 className="text-lg font-semibold text-gray-100 mb-4">Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-700 rounded-full"></div>
            <span className="text-gray-200 text-base">Fully automated token burning</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-700 rounded-full"></div>
            <span className="text-gray-200 text-base">Real-time burn tracking</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-700 rounded-full"></div>
            <span className="text-gray-200 text-base">Transparent transaction history</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-700 rounded-full"></div>
            <span className="text-gray-200 text-base">Automatic supply reduction</span>
          </div>
        </div>
      </div>

    </div>
  );
}
