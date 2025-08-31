import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isSmooth: boolean;
  memoryUsage?: number;
}

export function usePerformanceMonitor(enabled = false): PerformanceMetrics | null {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const rafRef = useRef<number>();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const monitorPerformance = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      frameCountRef.current++;

      // Store frame time for averaging
      frameTimesRef.current.push(deltaTime);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate FPS every second
      if (deltaTime >= 1000) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);

        // Get memory usage if available
        const memoryUsage = (performance as any).memory?.usedJSHeapSize;

        setMetrics({
          fps,
          frameTime: avgFrameTime,
          isSmooth: fps >= 55, // Consider 55+ FPS as smooth
          memoryUsage,
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(monitorPerformance);
    };

    rafRef.current = requestAnimationFrame(monitorPerformance);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  return metrics;
}

// Hook for monitoring scroll performance
export function useScrollPerformance() {
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollFPS: 60,
    isSmoothScrolling: true,
  });

  useEffect(() => {
    let scrollCount = 0;
    let lastScrollTime = performance.now();
    let rafId: number;

    const updateScrollMetrics = () => {
      const now = performance.now();
      const timeDiff = now - lastScrollTime;

      if (timeDiff >= 1000) {
        const fps = Math.round((scrollCount / timeDiff) * 1000);
        setScrollMetrics({
          scrollFPS: fps,
          isSmoothScrolling: fps >= 50,
        });
        scrollCount = 0;
        lastScrollTime = now;
      }

      rafId = requestAnimationFrame(updateScrollMetrics);
    };

    const handleScroll = () => {
      scrollCount++;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(updateScrollMetrics);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return scrollMetrics;
}
