import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Saskatchewan TTA transformed my game completely. The coaching here is world-class and the community is incredibly supportive.",
    author: "Sarah Chen",
    role: "Provincial Champion",
    avatar: "/api/placeholder/80/80",
  },
  {
    quote: "My daughter started here at age 8 and has developed not just her table tennis skills, but confidence and discipline that helps her in school too.",
    author: "Mike Rodriguez",
    role: "Parent",
    avatar: "/api/placeholder/80/80",
  },
  {
    quote: "The SPED program pushed me to levels I never thought possible. Now I'm competing at the national level thanks to their expert coaching.",
    author: "Alex Thompson", 
    role: "National Competitor",
    avatar: "/api/placeholder/80/80",
  },
  {
    quote: "As a coach, I'm impressed by the organization's commitment to player development at every level. It's truly a professional operation.",
    author: "Coach Maria Santos",
    role: "Certified Coach",
    avatar: "/api/placeholder/80/80",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
            What Our <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Community Says</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Hear from players, parents, and coaches about their experience with Saskatchewan Table Tennis Association.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <Card className="glass p-12 text-center relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 opacity-10">
                <Quote className="h-16 w-16 text-primary" />
              </div>

              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-foreground">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center shadow-medium">
                    <span className="text-white font-semibold text-xl">
                      {testimonials[currentIndex].author.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg font-sora">
                      {testimonials[currentIndex].author}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}