import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, UserPlus } from "lucide-react";
import { isLowEndMobile } from "@/lib/performance-utils";

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const rafRef = useRef<number>();
  const lastScrollY = useRef(0);
  const isLowEnd = isLowEndMobile();

  const throttledScrollHandler = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Only update if scroll position changed significantly (reduce unnecessary re-renders)
      if (Math.abs(scrollY - lastScrollY.current) > 10) {
        // Show after scrolling 50% of viewport height
        if (scrollY > windowHeight * 0.5 && !isDismissed) {
          setIsVisible(true);
        } else if (scrollY <= windowHeight * 0.3) {
          setIsVisible(false);
        }
        lastScrollY.current = scrollY;
      }

      rafRef.current = undefined;
    });
  }, [isDismissed]);

  useEffect(() => {
    // Skip scroll listener on low-end devices for performance
    if (isLowEnd) {
      // Show CTA after a delay on low-end devices
      const timer = setTimeout(() => {
        if (!isDismissed) {
          setIsVisible(true);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Use passive listener for better performance
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [throttledScrollHandler, isDismissed, isLowEnd]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={isLowEnd ? { opacity: 0 } : { opacity: 0, y: 100, scale: 0.8 }}
          animate={isLowEnd ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={isLowEnd ? { opacity: 0 } : { opacity: 0, y: 100, scale: 0.8 }}
          transition={isLowEnd ? { duration: 0.15 } : {
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.3 }
          }}
          className="fixed bottom-6 right-6 z-50 md:hidden" // Only show on mobile
        >
          <div className="glass rounded-2xl p-4 shadow-strong border border-primary/20">
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                variant="hero"
                className="flex-1 group shadow-medium"
                onClick={() => window.location.href = "/membership"}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Join Now
              </Button>
              
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Start your table tennis journey today
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}