import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import BurnWalletBalance from "@/components/BurnWalletBalance";
import BurnTimer from "@/components/BurnTimer";
import BurnHistory from "@/components/BurnHistory";
import BurnTrigger from "@/components/BurnTrigger";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
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