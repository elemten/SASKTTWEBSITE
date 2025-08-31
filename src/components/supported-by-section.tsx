import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const supporters = [
  {
    name: "Sask Sport",
    logo: "/partners/sask-sport.svg",
    url: "https://www.sasksport.ca/",
    ariaLabel: "Visit Sask Sport"
  },
  {
    name: "Sask Lotteries",
    logo: "/partners/sask-lotteries.svg",
    url: "https://www.sasklotteries.ca/",
    ariaLabel: "Visit Sask Lotteries"
  }
];

export function SupportedBySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight mb-6 font-sora text-green-800">
            Supported By
          </h2>
          <p className="text-lg text-gray-700 font-normal max-w-2xl mx-auto leading-relaxed font-sora">
            Our programs are supported by Sask Sport and Sask Lotteries—fueling growth and access to table tennis across the province.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
            {supporters.map((supporter, index) => (
              <motion.div
                key={supporter.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -4,
                  transition: { duration: 0.2 } 
                }}
                className="group"
              >
                <a
                  href={supporter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={supporter.ariaLabel}
                  className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 rounded-xl transition-all duration-200"
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/95 border border-gray-100 relative overflow-hidden">
                    {/* Subtle background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className="w-32 h-16 mb-4 flex items-center justify-center">
                        <img
                          src={supporter.logo}
                          alt={supporter.name}
                          className="h-12 w-auto opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-green-800 group-hover:text-primary transition-colors duration-200 font-sora">
                        {supporter.name}
                      </h3>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
          
          {/* Trust Caption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 font-medium font-sora">
              Trusted partners in Saskatchewan sports development
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
