import { useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';
import { isLowEndMobile } from '@/lib/performance-utils';

interface PerformanceMonitorProps {
  showOnMobile?: boolean;
  className?: string;
}

export function PerformanceMonitor({ showOnMobile = false, className = '' }: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const metrics = usePerformanceMonitor(process.env.NODE_ENV === 'development');
  const isLowEnd = isLowEndMobile();

  useEffect(() => {
    if (!showOnMobile && isLowEnd) return;

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showOnMobile, isLowEnd]);

  if (!isVisible || !metrics) return null;

  return (
    <div className={`fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-[9999] ${className}`}>
      <div className="space-y-1">
        <div>FPS: <span className={metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
          {metrics.fps}
        </span></div>
        <div>Frame Time: {metrics.frameTime.toFixed(2)}ms</div>
        <div>Status: <span className={metrics.isSmooth ? 'text-green-400' : 'text-red-400'}>
          {metrics.isSmooth ? 'Smooth' : 'Laggy'}
        </span></div>
        {metrics.memoryUsage && (
          <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        )}
        {isLowEnd && (
          <div className="text-yellow-400">Low-end device optimizations active</div>
        )}
      </div>
      <div className="mt-2 text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
