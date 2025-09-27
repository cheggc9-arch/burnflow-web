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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-[var(--pump-green)]">Phase-Based Rewards</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--pump-green)]">Early Adopter (0-24h):</span>
                <span className="font-bold">3x-1.5x multiplier</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--pump-blue)]">Growth Phase (1-7d):</span>
                <span className="font-bold">12 points/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">Sustained (7-30d):</span>
                <span className="font-bold">6 points/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Loyalty (30d+):</span>
                <span className="font-bold">√ scaling</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-[var(--pump-blue)]">Why Early Holders Win</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-[var(--pump-green)] font-bold mt-0.5">•</span>
                <span>First hour holders get <strong>3x multiplier</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--pump-green)] font-bold mt-0.5">•</span>
                <span>Hour-based tracking - every minute counts!</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--pump-green)] font-bold mt-0.5">•</span>
                <span>Early timing beats big bags in first 24h</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--pump-green)] font-bold mt-0.5">•</span>
                <span>Later holders can catch up with sustained holding</span>
              </li>
            </ul>
            <Link
              href="/formula"
              className="inline-flex items-center text-[var(--pump-green)] hover:text-[var(--pump-blue)] text-sm font-medium"
            >
              Learn more about the formula <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}