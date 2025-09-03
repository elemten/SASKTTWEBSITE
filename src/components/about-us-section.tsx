import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Calendar, Building2 } from "lucide-react";

// Hero images for rotation
const heroImages = [
  {
    src: "/home/hero-1.jpg",
    caption: "Table Tennis Action",
    alt: "Dynamic table tennis gameplay with players and ball trajectories"
  },
  {
    src: "/home/hero-2.jpg",
    caption: "Club Community",
    alt: "Table tennis club building with community members"
  },
  {
    src: "/home/hero-3.webp",
    caption: "Coaching & Training",
    alt: "Coach and student working together on technique"
  }
];

// Program badges
const programBadges = [
  { label: "Coaching & clinics", icon: Trophy },
  { label: "Provincial tournaments", icon: Calendar },
  { label: "Club support & grants", icon: Building2 }
];

// Stats data
const stats = [
  { number: 12, label: "clubs" },
  { number: 600, suffix: "+", label: "active members" },
  { number: 10, suffix: "+", label: "yearly events" }
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl font-bold text-primary">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function AboutUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Card - Left on desktop, first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 relative overflow-hidden border border-gray-100">
              {/* Optional background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full translate-y-12 -translate-x-12" />
              </div>
              
              <div className="relative z-10">
                {/* Section Header */}
                <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight mb-6 font-sora text-green-800">
                  About Us
                </h2>
                
                {/* Lead Paragraph */}
                <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed font-normal font-sora">
                  We're the provincial home of table tennis—building clubs, coaching talent, and running tournaments across Saskatchewan.
                </p>
                
                {/* Program Badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {programBadges.map((badge, index) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group"
                    >
                      <Badge 
                        variant="secondary" 
                        className="px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:shadow-soft transition-all duration-200 cursor-pointer font-sora"
                      >
                        <badge.icon className="h-4 w-4 mr-2" />
                        {badge.label}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-[2rem] font-bold text-green-800 mb-1 font-sora">
                        <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                      </div>
                      <div className="text-[0.9rem] text-gray-500 font-medium font-sora">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="hero" 
                      size="lg"
                      className="group font-sora min-w-[180px]"
                      asChild
                    >
                      <Link to="/membership">
                        Explore Programs
                        <Trophy className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="font-sora min-w-[180px] border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                      asChild
                    >
                      <Link to="/about">
                        About TTSask
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Media Panel - Right on desktop, first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100">
              {/* Image Carousel */}
              <div className="relative w-full h-full">
                {heroImages.map((image, index) => (
                  <motion.div
                    key={image.src}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index === currentImageIndex ? 1 : 0,
                      scale: index === currentImageIndex ? 1 : 1.05
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Caption Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <h3 className="text-white text-xl font-semibold mb-2 font-sora">
                        {image.caption}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Previous/Next Buttons */}
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? heroImages.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  (prev + 1) % heroImages.length
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
