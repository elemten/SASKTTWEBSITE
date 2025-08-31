import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    number: 500,
    suffix: "+",
    label: "Active Players",
    description: "Members across Saskatchewan",
  },
  {
    number: 15,
    suffix: "",
    label: "Active Clubs", 
    description: "Throughout the province",
  },
  {
    number: 50,
    suffix: "+",
    label: "Tournaments",
    description: "Organized annually",
  },
  {
    number: 25,
    suffix: "",
    label: "Certified Coaches",
    description: "Professional instruction",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  const display = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  return (
    <motion.span ref={ref} className="inline-block">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </motion.span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
  },
};

export function ImpactStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight mb-6 font-sora text-green-800">
            Our <span className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-normal font-sora">
            See how we're growing the sport of table tennis across Saskatchewan and building a stronger community.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className="glass p-8 text-center hover:shadow-strong transition-all duration-500 group hover:shadow-primary/20">
                <div className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent font-sora">
                  <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-sora group-hover:text-primary transition-colors">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground font-light">
                  {stat.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}