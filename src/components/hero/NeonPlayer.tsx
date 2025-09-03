import React from 'react';

interface NeonPlayerProps {
  className?: string;
}

export default function NeonPlayer({ className }: NeonPlayerProps) {
  return (
    <img
      src="/player-table-tennis.png"
      alt="Table tennis player in active pose"
      className={className}
      style={{ 
        willChange: 'transform',
        filter: 'drop-shadow(0 0 20px #18E36B) drop-shadow(0 0 10px rgba(24, 227, 107, 0.6))'
      }}
    />
  );
}
