import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
  { name: "Sport Canada", logo: "/api/placeholder/120/60" },
  { name: "Saskatchewan Parks", logo: "/api/placeholder/120/60" },
  { name: "City of Regina", logo: "/api/placeholder/120/60" },
  { name: "City of Saskatoon", logo: "/api/placeholder/120/60" },
  { name: "Table Tennis Canada", logo: "/api/placeholder/120/60" },
  { name: "Provincial Sports", logo: "/api/placeholder/120/60" },
];

export function PartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-semibold text-muted-foreground mb-2 font-sora">
            Proudly Supported By
          </h3>
          <p className="text-muted-foreground font-light">
            Our trusted partners and sponsors who help grow table tennis in Saskatchewan
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="aspect-[2/1] bg-white/50 rounded-lg flex items-center justify-center p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-medium">
                <div className="w-full h-full bg-muted/20 rounded flex items-center justify-center text-muted-foreground text-xs font-medium opacity-60 group-hover:opacity-80 transition-opacity">
                  {partner.name}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}