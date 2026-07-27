import { Hero } from "@/components/landing/Hero";
import { AgentsSection } from "@/components/landing/AgentsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Hero />
      <AgentsSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
