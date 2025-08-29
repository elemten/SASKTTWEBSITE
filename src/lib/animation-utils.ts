// Animation performance utilities for smooth 60fps animations

// Optimized easing curves for smooth motion
export const smoothEasing = {
  // Fast in, smooth out - great for UI interactions
  fastOut: [0.4, 0, 0.2, 1],
  // Smooth in, fast out - great for entrances
  smoothIn: [0.4, 0, 0.2, 1],
  // Bouncy spring for playful interactions
  bouncy: [0.68, -0.55, 0.265, 1.55],
  // Subtle spring for micro-interactions
  subtle: [0.25, 0.46, 0.45, 0.94],
};

// Performance-optimized spring configurations
export const springConfigs = {
  // Quick, responsive springs
  quick: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  // Smooth, natural springs
  smooth: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 },
  // Gentle, relaxed springs
  gentle: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  // Bouncy, playful springs
  bouncy: { type: "spring", stiffness: 500, damping: 15, mass: 0.6 },
};

// Common animation variants for consistent performance
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: smoothEasing.fastOut
    }
  }
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: smoothEasing.fastOut
    }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: smoothEasing.fastOut
    }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: smoothEasing.fastOut
    }
  }
};

// Stagger container variants
export const staggerContainer = (staggerDelay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

// Hover animations optimized for performance
export const hoverAnimations = {
  lift: {
    y: -8,
    transition: { duration: 0.2, ease: smoothEasing.fastOut }
  },
  scale: {
    scale: 1.05,
    transition: { duration: 0.2, ease: smoothEasing.fastOut }
  },
  glow: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2, ease: smoothEasing.fastOut }
  }
};

// Performance optimization helpers
export const performanceOptimizations = {
  // Use will-change only during animations
  willChange: (property: string) => ({ willChange: property }),
  
  // Disable will-change after animation
  clearWillChange: () => ({ willChange: 'auto' }),
  
  // Force GPU acceleration for transforms
  gpuAccelerated: { transform: 'translateZ(0)' },
  
  // Reduce motion for accessibility
  reducedMotion: {
    transition: { duration: 0.1 },
    animate: { scale: 1, y: 0, opacity: 1 }
  }
};

// Debounced scroll handler for smooth scrolling animations
export const createScrollHandler = (callback: () => void, delay = 16) => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Throttled resize handler for responsive animations
export const createResizeHandler = (callback: () => void, delay = 100) => {
  let timeoutId: NodeJS.Timeout;
  let lastCall = 0;
  return () => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      callback();
      lastCall = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay - (now - lastCall));
    }
  };
};
