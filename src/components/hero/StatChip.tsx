import React from 'react';

interface StatChipProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatChip({ value, label, icon, className }: StatChipProps) {
  return (
    <div
      className={`
        w-24 h-24 lg:w-26 lg:h-26 xl:w-28 xl:h-28
        rounded-full 
        flex flex-col items-center justify-center
        motion-safe:hover:shadow-2xl motion-safe:hover:-translate-y-2 motion-safe:active:scale-95 motion-safe:active:translate-y-0
        transition-all duration-300 ease-out
        relative overflow-hidden
        ${className || ''}
      `}
      style={{ 
        willChange: 'transform',
        minWidth: '88px',
        maxWidth: '104px',
        background: 'radial-gradient(circle at 30% 30%, #ffd700, #ffb347, #ffa500)',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.3)'
      }}
    >
      {/* Ping Pong Ball Highlight */}
      <div 
        className="absolute top-2 left-3 w-4 h-4 rounded-full bg-white/40"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 70%, transparent 100%)'
        }}
      />
      
      {/* Ping Pong Ball Seam Line */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 text-center">
        {icon && (
          <div className="text-white mb-1 drop-shadow-lg">
            {icon}
          </div>
        )}
        <div className="text-2xl font-bold text-white leading-none drop-shadow-lg">
          {value}
        </div>
        <div className="text-sm text-white/90 leading-none mt-1 drop-shadow-lg font-medium">
          {label}
        </div>
      </div>
      
      {/* Bottom Shadow for 3D Effect */}
      <div 
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
