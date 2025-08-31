import { useMemo } from 'react';
import { isMobile, isLowEndMobile, getOptimalAnimationSettings, prefersReducedMotion } from '@/lib/performance-utils';

export function useMobileOptimizedAnimations() {
  return useMemo(() => {
    const mobile = isMobile();
    const lowEnd = isLowEndMobile();
    const reducedMotion = prefersReducedMotion();

    const settings = getOptimalAnimationSettings();

    // For low-end devices or when reduced motion is preferred, minimize animations
    if (reducedMotion || lowEnd) {
      return {
        animate: false,
        whileHover: undefined,
        whileTap: undefined,
        transition: { duration: 0.1 },
        initial: false,
        exit: undefined,
      };
    }

    // For regular mobile devices, use optimized settings
    if (mobile) {
      return {
        animate: true,
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: {
          duration: settings.duration,
          ease: settings.ease,
          type: "tween"
        },
        initial: { opacity: 0, y: 10 },
        exit: { opacity: 0, y: -10 },
      };
    }

    // Desktop - full animations
    return {
      animate: true,
      whileHover: { scale: 1.05, y: -2 },
      whileTap: { scale: 0.95 },
      transition: {
        duration: settings.duration,
        ease: settings.ease,
        type: "spring",
        stiffness: 300,
        damping: 20
      },
      initial: { opacity: 0, y: 20 },
      exit: { opacity: 0, y: -20 },
    };
  }, []);
}

export function useConditionalAnimation<T>(
  defaultProps: T,
  mobileProps: Partial<T>,
  lowEndProps: Partial<T> = {}
): T {
  return useMemo(() => {
    const mobile = isMobile();
    const lowEnd = isLowEndMobile();
    const reducedMotion = prefersReducedMotion();

    if (reducedMotion || lowEnd) {
      return { ...defaultProps, ...lowEndProps };
    }

    if (mobile) {
      return { ...defaultProps, ...mobileProps };
    }

    return defaultProps;
  }, [defaultProps, mobileProps, lowEndProps]);
}
