import { motion } from "framer-motion";

interface PartnerLogosProps {
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

const partners = [
  {
    name: "Sask Sport",
    logo: "/partners/sask-sport.png",
    fallback: "/partners/sask-sport.svg",
    alt: "Sask Sport",
    url: "https://www.sasksport.ca/"
  },
  {
    name: "Sask Lotteries", 
    logo: "/partners/sask-lotteries.png",
    fallback: "/partners/sask-lotteries.svg",
    alt: "Sask Lotteries",
    url: "https://www.sasklotteries.ca/"
  }
];

const sizeClasses = {
  sm: "h-10",
  md: "h-16", 
  lg: "h-20"
};

export function PartnerLogos({ 
  className = "", 
  showLabels = true, 
  size = "md" 
}: PartnerLogosProps) {
  return (
    <div className={`flex justify-center items-center gap-6 ${className}`}>
      {partners.map((partner, index) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-2 relative"
        >
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-all duration-200"
            aria-label={`Visit ${partner.name} website`}
          >
            <img 
              src={partner.logo}
              alt={partner.alt}
              className={`${sizeClasses[size]} w-auto object-contain transition-all duration-300 hover:scale-105`}
              onError={(e) => {
                // Fallback to SVG if PNG fails
                const target = e.target as HTMLImageElement;
                target.src = partner.fallback;
              }}
            />
          </a>
          {showLabels && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-600 font-medium absolute -bottom-6 whitespace-nowrap"
            >
              {partner.name}
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
