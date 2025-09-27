export default function DistributionTimer() {
  return (
    <div className="pump-card rounded-xl p-6 animate-pulse-green">
      <div className="mb-6">
        <h3 className="text-xl font-bold pump-gradient-text">Next Distribution</h3>
      </div>
      <div className="">
        <div className="text-center text-gray-400">Distribution schedule not configured</div>
      </div>
    </div>
  );
}