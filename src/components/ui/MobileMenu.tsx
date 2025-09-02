// path: src/components/ui/MobileMenu.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

type Child = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: Child[] };

const ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "History & Mission", href: "/about/history-mission" },
      { label: "Team Members", href: "/about/staff-board" },
      { label: "Governance", href: "/about/governance" },
      { label: "Our Story", href: "/about" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Membership", href: "/membership" },
      { label: "Coaching", href: "/coaching" },
      { label: "Officials", href: "/officials" },
      { label: "Clubs", href: "/clubs" },
      { label: "Club Registration", href: "/clubs/register" },
    ],
  },
  {
    label: "Training",
    children: [
      { label: "Training Programs", href: "/play/training" },
      { label: "Clinics", href: "/play/clinics" },
      { label: "Advanced & Para", href: "/play/advanced-para" },
      { label: "Where to Play", href: "/play/locations" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MobileMenu({
  open,
  onOpenChange,
  items = ITEMS,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  items?: NavItem[];
}) {
  const location = useLocation();
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number | null>(null);

  // Close on route change
  useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Ensure menu is closed on mount
  useEffect(() => {
    if (!open) {
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  // Body scroll lock + focus trap
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstFocusable.current?.focus(), 0);
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onOpenChange(false);
    if (e.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const groups = useMemo(() => items, [items]);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        style={{
          opacity: open ? 0.4 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none'
        }}
        className={`fixed inset-0 z-[1000] bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none mobile-overlay-hidden"
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Right sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        data-mobile-menu={open.toString()}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          visibility: open ? 'visible' : 'hidden',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none'
        }}
        className={`safe-top fixed right-0 top-0 z-[1001] h-[100dvh] w-[86vw] max-w-[380px] bg-white shadow-xl outline-none transition-transform md:hidden mobile-menu-container ${
          open ? "translate-x-0" : "translate-x-full mobile-menu-hidden"
        }`}
        onKeyDown={handleKeyDown}
        ref={panelRef}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchMove={(e) => {
          if (startX.current === null) return;
          const delta = startX.current - e.touches[0].clientX;
          if (delta < -40) onOpenChange(false);
        }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <span className="text-base font-semibold">Menu</span>
          <button
            ref={firstFocusable}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-100 px-3 text-sm font-medium"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
            Close
          </button>
        </div>

        <div className="h-px w-full bg-neutral-200" />

        <nav role="navigation" aria-label="Mobile" className="overflow-y-auto p-2 pb-8">
          <ul className="space-y-1">
            {groups.map((item, idx) => {
              const openId = String(idx);
              const hasChildren = !!item.children?.length;

              if (!hasChildren) {
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href || "#"}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-neutral-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label} id={`accordion-${openId}`} data-open="false">
                  <button
                    id={`accordion-btn-${openId}`}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold hover:bg-neutral-100"
                    aria-expanded="false"
                    aria-controls={`accordion-panel-${openId}`}
                    onClick={() => {
                      const el = document.getElementById(`accordion-${openId}`);
                      const expanded = el?.getAttribute("data-open") === "true";
                      el?.setAttribute("data-open", expanded ? "false" : "true");
                      const btn = document.getElementById(`accordion-btn-${openId}`);
                      btn?.setAttribute("aria-expanded", expanded ? "false" : "true");
                    }}
                  >
                    <span>{item.label}</span>
                    <Chevron open={false} />
                  </button>

                  <div
                    id={`accordion-panel-${openId}`}
                    className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 data-[open=true]:grid-rows-[1fr]"
                    data-open="false"
                  >
                    <div className="overflow-hidden">
                      <ul className="pl-2">
                        {item.children!.map((c) => (
                          <li key={c.label}>
                            <Link
                              to={c.href}
                              className="block rounded-lg px-3 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
