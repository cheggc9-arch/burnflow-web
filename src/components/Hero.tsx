import ContractAddress from "./ContractAddress";

export default function Hero() {
  return (
    <div className="relative text-center space-y-4 py-12">
      <div className="relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold pump-gradient-text drop-shadow-lg">
          It&apos;s Time to Reward Holders!
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-lg">
          Rewarding all holders with creator fees from Pump.fun! More volume, more fees distributed!
        </p>
      </div>
      <div className="flex justify-center mt-6 relative z-10">
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/30 backdrop-blur-sm">
          <ContractAddress />
        </div>
      </div>
    </div>
  );
}
