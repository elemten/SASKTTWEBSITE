import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutUsSection } from "@/components/about-us-section";
import { SupportedBySection } from "@/components/supported-by-section";
import { ImpactStatsSection } from "@/components/impact-stats-section";
import { ProgramsSection } from "@/components/programs-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { CommunitySpotlightSection } from "@/components/community-spotlight-section";
import { PartnersSection } from "@/components/partners-section";
import { Footer } from "@/components/footer";
import { FloatingCTA } from "@/components/floating-cta";
import { Sitemap } from "@/components/sitemap";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with its own dark background */}
      <HeroSection />

      {/* Content sections with subtle light green background */}
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <AboutUsSection />
        <SupportedBySection />
        <ImpactStatsSection />
        <ProgramsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <UpcomingEventsSection />
        <CommunitySpotlightSection />
        <PartnersSection />
        <Sitemap />
      </div>

      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
