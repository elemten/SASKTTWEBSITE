import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Static dark green to medium green vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b7d59] via-[#0ea371] to-[#12b07b]" />
    </div>
  );
}
