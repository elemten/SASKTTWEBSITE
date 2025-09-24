// src/components/FloatingBookNow.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowDown } from "lucide-react";

interface Props {
  /** The element id you want to scroll to (e.g. "booking-form" or "booking-section") */
  targetId: string;
  /** Pixels to keep under a sticky header */
  offset?: number;
}

const FloatingBookNow = ({ targetId, offset = 64 }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    window.scrollTo({
      top: rect.top + scrollTop - offset,
      behavior: "smooth",
    });
  };

  if (!mounted) return null;

  // Render as fixed top banner
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
        backgroundColor: "#16a34a",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={handleClick}
        aria-label="Book now - scroll to booking form"
        style={{
          backgroundColor: "transparent",
          border: "2px solid white",
          borderRadius: "24px",
          color: "white",
          fontSize: "16px",
          fontWeight: "700",
          padding: "8px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <ArrowDown style={{ width: 18, height: 18 }} />
        <span className="hidden sm:inline">Book SPED Session Now</span>
        <span className="sm:hidden">Book Now</span>
      </button>
    </div>,
    document.body
  );
};

export default FloatingBookNow;
