import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/hero-section";
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
      <HeroSection />
      <ImpactStatsSection />
      <ProgramsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <UpcomingEventsSection />
      <CommunitySpotlightSection />
      <PartnersSection />
      <Sitemap />
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
