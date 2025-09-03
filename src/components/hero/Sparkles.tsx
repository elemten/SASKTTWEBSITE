import React from 'react';

interface SparklesProps {
  count?: number;
  className?: string;
}

export default function Sparkles({ count = 32, className }: SparklesProps) {
  const generateSparkle = (index: number) => {
    const size = Math.random() * 3 + 1; // 1-4px
    const left = Math.random() * 80 + 10; // 10-90%
    const top = Math.random() * 80 + 10; // 10-90%
    const delay = Math.random() * 2.4; // 0-2.4s
    const duration = 2 + Math.random() * 1; // 2-3s

    return (
      <div
        key={index}
        className="absolute w-1 h-1 bg-white rounded-full motion-safe:animate-twinkle"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
        aria-hidden="true"
      />
    );
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className || ''}`}>
      {Array.from({ length: count }, (_, index) => generateSparkle(index))}
    </div>
  );
}
