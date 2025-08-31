/**
 * Performance utilities for 60fps animations and smooth scrolling
 */

/**
 * Throttle function calls using requestAnimationFrame
 * @param callback Function to throttle
 * @param delay Minimum delay between calls (default: 16ms for ~60fps)
 */
export function throttleRAF<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 16
): T {
  let lastCall = 0;
  let rafId: number | null = null;

  return ((...args: any[]) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      rafId = requestAnimationFrame(() => {
        callback(...args);
        lastCall = Date.now();
        rafId = null;
      });
    }
  }) as T;
}

/**
 * Debounce function calls
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  }) as T;
}

/**
 * Intersection Observer with performance optimizations
 * @param callback Callback function
 * @param options Intersection Observer options
 */
export function createOptimizedIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Performance-optimized scroll listener
 * @param callback Function to call on scroll
 * @param threshold Minimum scroll distance to trigger callback
 */
export function createOptimizedScrollListener(
  callback: (scrollY: number) => void,
  threshold: number = 10
): () => void {
  let rafId: number | null = null;
  let lastScrollY = 0;

  const throttledCallback = () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) >= threshold) {
        callback(scrollY);
        lastScrollY = scrollY;
      }

      rafId = null;
    });
  };

  window.addEventListener('scroll', throttledCallback, { passive: true });

  return () => {
    window.removeEventListener('scroll', throttledCallback);
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
}

/**
 * Preload images for better performance
 * @param src Image source URL
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe animation frame wrapper
 */
export class AnimationFrameManager {
  private rafId: number | null = null;
  private isRunning = false;

  start(callback: () => void): void {
    if (this.isRunning) return;

    this.isRunning = true;

    const loop = () => {
      callback();
      if (this.isRunning) {
        this.rafId = requestAnimationFrame(loop);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
