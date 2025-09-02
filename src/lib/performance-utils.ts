/**
 * Performance utilities for 60fps animations and smooth scrolling
 */

/**
 * Throttle function calls using requestAnimationFrame
 * @param callback Function to throttle
 * @param delay Minimum delay between calls (default: 16ms for ~60fps)
 */












/**
 * Mobile device detection
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    'ontouchstart' in window
  );
};

/**
 * High-performance mobile detection (more aggressive)
 */
export const isLowEndMobile = (): boolean => {
  if (typeof window === 'undefined') return false;

  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 480;
  const hasTouch = 'ontouchstart' in window;

  // Check for low-end device indicators
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  );

  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2;

  return (isMobileDevice || isSmallScreen) && (isSlowConnection || isLowMemory || hasTouch);
};


