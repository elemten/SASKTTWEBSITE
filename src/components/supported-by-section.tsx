import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PartnerLogos } from "./partner-logos";

const supporters = [
  {
    name: "Sask Sport",
    logo: "/partners/sask-sport.png",
    fallback: "/partners/sask-sport.svg",
    url: "https://www.sasksport.ca/",
    ariaLabel: "Visit Sask Sport"
  },
  {
    name: "Sask Lotteries",
    logo: "/partners/sask-lotteries.png",
    fallback: "/partners/sask-lotteries.svg",
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
          {/* Partner Logos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <PartnerLogos size="lg" showLabels={true} />
          </motion.div>
          
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
