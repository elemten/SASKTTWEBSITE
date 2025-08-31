import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Trophy, Zap, Target } from "lucide-react";

const programs = [
  {
    icon: Users,
    title: "Youth Programs",
    description: "Age-appropriate training for young players aged 6-17, focusing on fundamentals and fun",
    features: ["Weekly group lessons", "Equipment provided", "Qualified coaches", "Tournament prep"],
    image: "/api/placeholder/400/250",
    href: "/programs/youth",
  },

  {
    icon: Zap,
    title: "SPED Training",
    description: "Specialized coaching programs designed to elevate competitive players",
    features: ["1-on-1 coaching", "Video analysis", "Mental training", "Competition strategy"],
    image: "/api/placeholder/400/250",
    href: "/programs/sped",
  },
  {
    icon: Target,
    title: "Tournaments",
    description: "Regular tournaments from beginner-friendly to provincial championships",
    features: ["Monthly events", "All skill levels", "Rating system", "Prize categories"],
    image: "/api/placeholder/400/250",
    href: "/programs/tournaments",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
  },
};

export function ProgramsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-sora">
            Our <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Programs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Whether you're just starting or aiming for the podium, we have programs designed to help you achieve your table tennis goals.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.03,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group h-full"
            >
              <Card className="glass h-full overflow-hidden hover:shadow-strong transition-all duration-500 group-hover:shadow-primary/20">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                      <program.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 font-sora group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 font-light leading-relaxed">
                    {program.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}