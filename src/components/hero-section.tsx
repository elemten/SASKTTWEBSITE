import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trophy, UserPlus, Zap } from "lucide-react";

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
    href: "/clubs",
    gradient: "from-primary to-primary-light",
  },

];

// Optimized animation variants for 60fps
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Reduced from 0.2 for faster loading
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Reduced y distance for smoother animation
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4, // Reduced from 0.6-0.8 for snappier feel
      ease: [0.4, 0, 0.2, 1] // Custom easing for smooth motion
    }
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(var(--primary-light)) 0%, transparent 50%)`,
        }}
      />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants} 
            className="mb-6"
            style={{ willChange: 'transform, opacity' }}
          >
            <Badge 
              variant="secondary" 
              className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
            >
              Official Saskatchewan Table Tennis Association
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
            style={{ willChange: 'transform, opacity' }}
          >
            Excellence in
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Table Tennis
            </span>
          </motion.h1>

          {/* Subtitle - Critical LCP content loads immediately */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ willChange: 'transform, opacity' }}
          >
            Join Saskatchewan's premier table tennis community. From beginner 
            training to competitive play, we're here to elevate your game.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            style={{ willChange: 'transform, opacity' }}
          >
            <Button 
              variant="hero" 
              size="xl"
              className="group"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="glass" 
              size="xl"
            >
              View Programs
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {heroCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 10 }
                }}
                className="group"
                style={{ willChange: 'transform' }}
              >
                <Card className="glass p-8 h-full hover:shadow-strong transition-all duration-500 hover:scale-[1.02] group-hover:shadow-primary/20">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${card.gradient} mb-6 shadow-medium`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors font-sora">
                    {card.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed font-light">
                    {card.description}
                  </p>

                  {card.pricing && (
                    <p className="text-sm font-medium text-primary mb-6 bg-primary/10 rounded-lg px-3 py-2">
                      {card.pricing}
                    </p>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-full blur-xl hidden lg:block"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
        className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-r from-primary-light/20 to-primary-lighter/20 rounded-full blur-xl hidden lg:block"
      />
    </section>
  );
}