import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { CommunityFeedSection } from "./components/CommunityFeedSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function NewLanding() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      {/* Decorative gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-radial from-blue-400/30 via-blue-500/20 to-transparent rounded-full blur-3xl filter" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-radial from-indigo-400/25 via-indigo-500/15 to-transparent rounded-full blur-3xl filter" />
        <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] bg-gradient-radial from-blue-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl filter" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <CommunityFeedSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
