import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import TreasuryBalance from "@/components/TreasuryBalance";
import DistributionTimer from "@/components/DistributionTimer";
import DistributionHistory from "@/components/DistributionHistory";
import HolderLeaderboard from "@/components/HolderLeaderboard";
import HowItWorks from "@/components/HowItWorks";
import EarlyAdopterAdvantage from "@/components/EarlyAdopterAdvantage";
import DistributionTrigger from "@/components/DistributionTrigger";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Hero />
        <Stats />
        <TreasuryBalance />
        <DistributionTimer />
        <DistributionHistory />
        <HolderLeaderboard />
        {process.env.NODE_ENV === 'development' && <DistributionTrigger />}
        <HowItWorks />
        <EarlyAdopterAdvantage />
      </main>
      <Footer />
    </div>
  );
}