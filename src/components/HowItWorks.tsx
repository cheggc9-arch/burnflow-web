export default function HowItWorks() {
  return (
    <div className="pump-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">How It Works</h3>
      </div>
      <div className="">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto pump-gradient rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">1</span>
            </div>
            <h3 className="font-semibold text-lg">Hold Tokens</h3>
            <p className="text-gray-400 text-sm">Hold at least 20,000 tokens in your wallet to be eligible for rewards.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto pump-gradient rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">2</span>
            </div>
            <h3 className="font-semibold text-lg">Earn Weight</h3>
            <p className="text-gray-400 text-sm">Your reward weight increases based on token balance and holding duration.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto pump-gradient rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">3</span>
            </div>
            <h3 className="font-semibold text-lg">Receive Rewards</h3>
            <p className="text-gray-400 text-sm">Get your share of creator fees automatically distributed to your wallet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}