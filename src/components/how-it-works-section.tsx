import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Play, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Join as a Member",
    description: "Sign up for membership and choose the plan that fits your goals",
    details: ["Online registration", "Choose membership type", "Instant access to facilities"],
  },
  {
    step: "02", 
    icon: Calendar,
    title: "Book Training/Events",
    description: "Reserve your spot in training sessions, classes, or tournaments",
    details: ["Easy online booking", "Choose skill level", "Flexible scheduling"],
  },
  {
    step: "03",
    icon: Play,
    title: "Play & Compete",
    description: "Start playing, improve your skills, and compete in tournaments",
    details: ["Regular practice", "Skill development", "Tournament participation"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
  },
};

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-sora">
            How to <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Get Started</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Getting started with table tennis at Saskatchewan TTA is simple. Follow these three easy steps to begin your journey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={stepVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                {/* Step Number and Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-primary to-primary-light flex items-center justify-center shadow-strong relative z-10">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <Card className="glass p-8 hover:shadow-medium transition-all duration-500">
                    <h3 className="text-2xl font-semibold mb-4 font-sora">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 font-light text-lg leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-primary to-primary-light opacity-30" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button size="xl" variant="hero" className="group">
            Start Your Journey Today
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}