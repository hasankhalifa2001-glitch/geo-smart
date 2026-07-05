import { Navbar } from "./_components/Navbar";
import { HeroSection } from "./_components/HeroSection";
import { StatsBar } from "./_components/StatsBar";
import { FeaturesSection } from "./_components/FeaturesSection";
import { DemoSection } from "./_components/DemoSection";
import { Footer } from "./_components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
