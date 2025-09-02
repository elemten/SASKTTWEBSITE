import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Trophy, UserPlus, Zap, Play, Target, Award, Users } from "lucide-react";
import { isMobile } from "@/lib/performance-utils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const isMobileDevice = isMobile();

  return (
    <>
      {/* Enhanced Hero Section */}
      <section
        ref={containerRef}
        id="home-hero"
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 pt-14"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900" />

          {/* Floating geometric shapes */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 blur-sm"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-white/3 blur-sm"
          />
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/4 blur-sm"
          />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
        </div>

        {/* Content Container */}
        <motion.div
          style={{ y }}
          className="relative z-10 container mx-auto px-6 lg:px-8"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

            {/* Left Content Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left space-y-8"
            >

              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block"
              >
                <Badge className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-base font-semibold tracking-wide">
                  Table Tennis Saskatchewan
                </Badge>
              </motion.div>

              {/* Enhanced Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] tracking-tight">
                  Elevate Your
                  <br />
                  <span className="text-[var(--tt-green-vibrant)]">
                    Table Tennis
                  </span>
                  <br />
                  <span className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white">
                    Journey
                  </span>
          </h1>
              </motion.div>

              {/* Enhanced Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl text-white max-w-2xl leading-relaxed font-light"
              >
                Join Saskatchewan's premier table tennis community.
                From beginner fundamentals to competitive excellence,
                we elevate every player's game with world-class coaching,
                state-of-the-art facilities, and championship opportunities.
              </motion.p>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
            <Button 
              variant="hero" 
              size="xl"
                    className="group px-8 py-6 text-lg font-bold shadow-2xl hover:shadow-3xl"
            >
              Get Started Today
                    <motion.div
                      className="ml-3"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
            </Button>
                </motion.div>
            
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
            <Button 
              variant="glass" 
              size="xl"
                    className="px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
            >
                    <Play className="mr-2 h-5 w-5" />
              View Programs
            </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8 text-white"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">1800+ Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-medium">23 Clubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-medium">80+ Events</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
              className="relative hidden lg:block"
            >

              {/* Main Visual Element */}
              <div className="relative">

                {/* Animated Table Tennis Elements */}
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10"
                >

                  {/* Floating Stats */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    className="grid grid-cols-2 gap-6 mb-8"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">1800+</div>
                      <div className="text-sm text-white">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">23</div>
                      <div className="text-sm text-white">Clubs Province-Wide</div>
                    </div>
                  </motion.div>

                  {/* Feature Highlights */}
                  <div className="space-y-4">
                    {[
                      { icon: Trophy, text: "Provincial Championships" },
                      { icon: Users, text: "Expert Coaching" },
                      { icon: Target, text: "All Skill Levels" },
                      { icon: Award, text: "Tournament Ready" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.1 }}
                        className="flex items-center gap-3 text-white/90"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 blur-xl"
                />
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1.2, 1, 1.2],
                  }}
                  transition={{
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 blur-xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced CTA Cards Section */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 blur-lg hidden lg:block"
        />
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400/20 to-yellow-500/20 blur-lg hidden lg:block"
        />

        <div className="relative z-10 container mx-auto px-6 lg:px-8">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 px-6 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 font-semibold">
                🚀 Explore Our Services
              </Badge>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-primary bg-clip-text text-transparent font-black">
                Excel at Table Tennis
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From membership benefits to tournament preparation, we provide comprehensive
              support for table tennis players at every level across Saskatchewan.
            </p>
          </motion.div>

          {/* Enhanced Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

            {/* Card 1: Become a Member */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 overflow-hidden"
            >

              {/* Consistent Green Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative p-8 h-full flex flex-col">

                {/* Icon Header */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-6"
                >
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="h-6 w-6" />
                    <span className="ml-2 font-bold">Become a Member</span>
                  </Button>
                </motion.div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  Become a Member
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Join Saskatchewan's premier table tennis community and unlock exclusive member benefits,
                    priority tournament registration, and access to provincial coaching programs.
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Priority tournament registration
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Access to provincial coaching
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Member-exclusive events
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                <Button
                  variant="hero"
                  size="lg"
                    className="w-full py-4 font-semibold shadow-lg hover:shadow-xl"
                >
                  Learn More
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                </Button>
                </motion.div>
              </div>
            </motion.article>

            {/* Card 2: Book Training */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 overflow-hidden"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative p-8 h-full flex flex-col">

                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-6"
                >
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    <Zap className="h-6 w-6" />
                    <span className="ml-2 font-bold">Book Training</span>
                  </Button>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  Book Training
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Schedule personalized or group training sessions with certified provincial coaches.
                    Available at multiple locations across Saskatchewan.
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      1-on-1 and group sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Certified provincial coaches
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      All skill levels welcome
                    </li>
                  </ul>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                <Button
                  variant="hero"
                  size="lg"
                    className="w-full py-4 font-semibold shadow-lg hover:shadow-xl"
                >
                  Learn More
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                </Button>
                </motion.div>
              </div>
            </motion.article>

            {/* Card 3: Book a Clinic */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 overflow-hidden"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative p-8 h-full flex flex-col">

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-6"
                >
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    <Trophy className="h-6 w-6" />
                    <span className="ml-2 font-bold">Book a Clinic</span>
                  </Button>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  Book a Clinic
                </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reserve on-site coaching clinics for your school, organization, or community group.
                    Perfect for introducing table tennis to new players.
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      On-site clinic visits
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Schools and communities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Beginner-friendly programs
                    </li>
                  </ul>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                <Button
                  variant="hero"
                  size="lg"
                    className="w-full py-4 font-semibold shadow-lg hover:shadow-xl"
                >
                  Learn More
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                </Button>
                </motion.div>
              </div>
            </motion.article>

            {/* Card 4: Register / Start a New Club */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100/50 overflow-hidden"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              <div className="relative p-8 h-full flex flex-col">

                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-6"
                >
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl"
                  >
                    <Award className="h-6 w-6" />
                    <span className="ml-2 font-bold">Start a Club</span>
                  </Button>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    Start a Club
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Start your own table tennis club and get approved for provincial funding and grants.
                    We provide guidance and support throughout the process.
                  </p>

                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Provincial funding available
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      Expert guidance provided
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      MAP grant applications
                    </li>
                  </ul>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                <Button
                  variant="hero"
                  size="lg"
                    className="w-full py-4 font-semibold shadow-lg hover:shadow-xl"
                >
                  Learn More
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                </Button>
                </motion.div>
              </div>
            </motion.article>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="hero"
                size="xl"
                className="px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl"
              >
                Explore All Programs
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}