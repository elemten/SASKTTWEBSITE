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
      {/* Hero Section - Static, Clean */}
      <section id="home-hero" className="relative bg-gradient-to-b from-[#0b7d59] via-[#10a678] to-[#12b07b] min-h-[72vh] flex items-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          {/* Badge */}
          <p className="inline-block rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-white/90 bg-white/15 backdrop-blur-sm">
            Official Saskatchewan Table Tennis Association
          </p>

          {/* Main Heading */}
          <h1 className="mt-6 font-extrabold tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl">
            Excellence in<br className="hidden sm:block"/> Table Tennis
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-3xl mx-auto">
            Join Saskatchewan's premier table tennis community. From beginner training to competitive play, we're here to elevate your game.
          </p>

          {/* CTA Buttons */}
          <div className="hero__actions">
            <Button 
              variant="hero" 
              size="xl"
              className="group shadow-soft hover:shadow-medium hover:bg-green-600 transition-all duration-250 ease-in-out"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="glass" 
              size="xl"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-250 ease-in-out backdrop-blur-sm"
            >
              View Programs
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="bg-gradient-to-b from-[#eaf7f1] to-[#f6fff9] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Become a Member */}
            <article className="group rounded-2xl bg-white shadow-sm hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-5 flex flex-col h-full">
                {/* Icon Header */}
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#0b7d59] to-[#10a678] mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 transform group-hover:scale-105">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#0b7d59] transition-colors duration-200">
                  Become a Member
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Join the provincial association and unlock member benefits.
                </p>
                
                {/* Button */}
                <div className="mt-auto">
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full group-hover:bg-[#0a6e50] transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>

            {/* Card 2: Book Training */}
            <article className="group rounded-2xl bg-white shadow-sm hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-5 flex flex-col h-full">
                {/* Icon Header */}
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#0b7d59] to-[#10a678] mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 transform group-hover:scale-105">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#0b7d59] transition-colors duration-200">
                  Book Training
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Schedule personal or group training with certified coaches.
                </p>
                
                {/* Button */}
                <div className="mt-auto">
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full group-hover:bg-[#0a6e50] transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>

            {/* Card 3: Book a Clinic */}
            <article className="group rounded-2xl bg-white shadow-sm hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-5 flex flex-col h-full">
                {/* Icon Header */}
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#0b7d59] to-[#10a678] mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 transform group-hover:scale-105">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#0b7d59] transition-colors duration-200">
                  Book a Clinic
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Book a clinic for your school or organization.
                </p>
                
                {/* Button */}
                <div className="mt-auto">
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full group-hover:bg-[#0a6e50] transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>

            {/* Card 4: Register / Start a New Club */}
            <article className="group rounded-2xl bg-white shadow-sm hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-5 flex flex-col h-full">
                {/* Icon Header */}
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-[#0b7d59] to-[#10a678] mb-4 shadow-medium group-hover:shadow-strong transition-all duration-300 transform group-hover:scale-105">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#0b7d59] transition-colors duration-200">
                  Register / Start a New Club
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">
                  Register a club and get approved for MAP grants.
                </p>
                
                {/* Button */}
                <div className="mt-auto">
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full group-hover:bg-[#0a6e50] transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}