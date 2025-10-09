import Header from "@/components/Header";
import Hero from "@/components/burn/Hero";
import Stats from "@/components/burn/Stats";
import BurnWalletBalance from "@/components/burn/BurnWalletBalance";
import BurnTimer from "@/components/burn/BurnTimer";
import BurnHistory from "@/components/burn/BurnHistory";
import BurnTrigger from "@/components/burn/BurnTrigger";
import HowItWorks from "@/components/burn/HowItWorks";
import Footer from "@/components/Footer";

export default function BurnPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Hero />
        <Stats />
        <BurnWalletBalance />
        <BurnTimer />
        <BurnHistory />
        <BurnTrigger />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
