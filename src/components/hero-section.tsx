import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Trophy, UserPlus, Zap } from "lucide-react";
import HeroBackground from "./hero-background";

const heroCards = [
  {
    icon: UserPlus,
    title: "Become a Member",
    description: "Join the provincial association and unlock member benefits.",
    href: "/membership",
    gradient: "from-primary to-primary-light",
    pricing: "Monthly: $45, Yearly: $450",
  },
  {
    icon: Zap,
    title: "Book Training",
    description: "Schedule personal or group training with certified coaches.",
    href: "/play/training",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: Trophy,
    title: "Book a Clinic",
    description: "Book a clinic for your school.",
    href: "/play/clinics",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: UserPlus,
    title: "Register / Start a New Club",
    description: "Register a club and get approved for MAP grants.",
    href: "/clubs/register",
    gradient: "from-primary to-primary-light",
  },
];

export function HeroSection() {
  return (
    <>
      {/* Hero Section - Clean & Minimal */}
      <section id="home-hero" className="hero relative bg-gradient-to-b from-[#0b7d59] via-[#10a678] to-[#12b07b] min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-5xl px-8 text-center">
          {/* Clean Badge */}
          <div className="inline-block rounded-full px-8 py-4 bg-white/15 backdrop-blur-md border border-white/20 mb-12">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Table Tennis Saskatchewan
            </h2>
          </div>

          {/* Main Heading - Clean & Spacious */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            Excellence in<br className="hidden sm:block"/> Table Tennis
          </h1>

          {/* Subtext - Better Spacing */}
          <p className="text-xl sm:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
            Join Saskatchewan's premier table tennis community. From beginner training to competitive play, we're here to elevate your game.
          </p>

          {/* CTA Buttons - Clean & Spaced */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              variant="hero"
              size="xl"
              className="px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="glass" 
              size="xl"
              className="btn-secondary px-12 py-6 text-lg font-semibold bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              View Programs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Cards Section - Cleaner Spacing */}
      <section className="bg-gradient-to-b from-[#eaf7f1] to-[#f6fff9] py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Become a Member */}
            <article className="group rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="p-8 flex flex-col h-full">
                {/* Icon Header - Hero Button Style */}
                <Button
                  variant="hero"
                  size="lg"
                  className="mb-6 px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-8 w-8" />
                  <span className="ml-2">Become a Member</span>
                </Button>
                
                {/* Content - Better Typography */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0b7d59] transition-colors duration-300">
                  Become a Member
                </h3>
                <p className="text-base text-gray-600 mb-8 flex-grow leading-relaxed">
                  Join the provincial association and unlock member benefits.
                </p>
                
                {/* Button - Cleaner */}
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full py-4 text-base font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </article>

            {/* Card 2: Book Training */}
            <article className="group rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="p-8 flex flex-col h-full">
                <Button
                  variant="hero"
                  size="lg"
                  className="mb-6 px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <Zap className="h-8 w-8" />
                  <span className="ml-2">Book Training</span>
                </Button>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0b7d59] transition-colors duration-300">
                  Book Training
                </h3>
                <p className="text-base text-gray-600 mb-8 flex-grow leading-relaxed">
                  Schedule personal or group training with certified coaches.
                </p>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full py-4 text-base font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </article>

            {/* Card 3: Book a Clinic */}
            <article className="group rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="p-8 flex flex-col h-full">
                <Button
                  variant="hero"
                  size="lg"
                  className="mb-6 px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <Trophy className="h-8 w-8" />
                  <span className="ml-2">Book a Clinic</span>
                </Button>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0b7d59] transition-colors duration-300">
                  Book a Clinic
                </h3>
                <p className="text-base text-gray-600 mb-8 flex-grow leading-relaxed">
                  Book a clinic for your school or organization.
                </p>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full py-4 text-base font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </article>

            {/* Card 4: Register / Start a New Club */}
            <article className="group rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="p-8 flex flex-col h-full">
                <Button
                  variant="hero"
                  size="lg"
                  className="mb-6 px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                >
                  <Trophy className="h-8 w-8" />
                  <span className="ml-2">Register / Start a New Club</span>
                </Button>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0b7d59] transition-colors duration-300">
                  Register / Start a New Club
                </h3>
                <p className="text-base text-gray-600 mb-8 flex-grow leading-relaxed">
                  Register a club and get approved for MAP grants.
                </p>
                
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full py-4 text-base font-semibold"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}