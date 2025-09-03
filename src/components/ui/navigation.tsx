// path: src/components/ui/navigation.tsx
import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useState, useEffect, useRef } from "react";
import MobileMenu from "./MobileMenu";

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About Us",
    children: [
      { href: "/about/history-mission", label: "History & Mission" },
      { href: "/about/staff-board", label: "Staff & Board" },
      { href: "/about/governance", label: "Governance" },
      { href: "/about", label: "Our Story" },
    ]
  },
  {
    href: "/membership",
    label: "Services",
    children: [
      { href: "/membership", label: "Membership" },
      { href: "/coaching", label: "Coaching" },
      { href: "/officials", label: "Officials" },
      { href: "/clubs", label: "Clubs" },
      { href: "/clubs/register", label: "Club Registration" },
    ]
  },
  {
    href: "/play/training",
    label: "Training",
    children: [
      { href: "/play/training", label: "Training Programs" },
      { href: "/play/clinics", label: "Clinics" },
      { href: "/play/advanced-para", label: "Advanced & Para" },
      { href: "/play/locations", label: "Where to Play" },
    ]
  },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact Us" },
];

export function Navigation({ className }: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Close dropdowns on Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (href: string) => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(href);
  };

  const handleMouseLeave = () => {
    // Small delay to prevent accidental closing when moving between button and dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className={cn("nav safe-top", className)}>
      {/* ===== Desktop header (unchanged) ===== */}
      <div className="nav__inner hidden md:grid">
        {/* Brand Section */}
        <NavLink to="/" className="brand">
          <div className="h-12 w-12 rounded-xl overflow-hidden shadow-medium bg-primary/20 flex items-center justify-center border border-primary/30">
            <img
              src={logo}
              alt="Table Tennis Saskatchewan"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="brand__text">
            <div className="brand__title">Table Tennis Saskatchewan</div>
            <div className="brand__sub">Official Association</div>
          </div>
        </NavLink>

        {/* Primary Navigation */}
        <nav className="primary" aria-label="Primary">
          <ul className="primary__list">
            {/* Home */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn("nav-item", isActive && "nav-item--active")
                }
              >
                Home
              </NavLink>
            </li>

            {/* About Dropdown */}
            <li 
              className="has-dropdown"
              onMouseEnter={() => handleMouseEnter('/about')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/about'}
              >
                About Us <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/about' && "dropdown--open"
                )}
                role="menu"
                onMouseEnter={() => handleMouseEnter('/about')}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink to="/about/history-mission" className="dropdown__item">
                  History &amp; Mission
                </NavLink>
                <NavLink to="/about/staff-board" className="dropdown__item">
                  Staff &amp; Board
                </NavLink>
                <NavLink to="/about/governance" className="dropdown__item">
                  Governance
                </NavLink>
                <NavLink to="/about" className="dropdown__item">
                  Our Story
                </NavLink>
              </div>
            </li>

            {/* Services Dropdown */}
            <li 
              className="has-dropdown"
              onMouseEnter={() => handleMouseEnter('/membership')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/membership'}
              >
                Services <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/membership' && "dropdown--open"
                )}
                role="menu"
                onMouseEnter={() => handleMouseEnter('/membership')}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink to="/membership" className="dropdown__item">
                  Membership
                </NavLink>
                <NavLink to="/coaching" className="dropdown__item">
                  Coaching
                </NavLink>
                <NavLink to="/officials" className="dropdown__item">
                  Officials
                </NavLink>
                <NavLink to="/clubs" className="dropdown__item">
                  Clubs
                </NavLink>
                <NavLink to="/clubs/register" className="dropdown__item">
                  Club Registration
                </NavLink>
              </div>
            </li>

            {/* Training Dropdown */}
            <li 
              className="has-dropdown"
              onMouseEnter={() => handleMouseEnter('/play/training')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/play/training'}
              >
                Training <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/play/training' && "dropdown--open"
                )}
                role="menu"
                onMouseEnter={() => handleMouseEnter('/play/training')}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink to="/play/training" className="dropdown__item">
                  Training Programs
                </NavLink>
                <NavLink to="/play/clinics" className="dropdown__item">
                  Clinics
                </NavLink>
                <NavLink to="/play/advanced-para" className="dropdown__item">
                  Advanced &amp; Para
                </NavLink>
                <NavLink to="/play/locations" className="dropdown__item">
                  Where to Play
                </NavLink>
              </div>
            </li>

            <li>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  cn("nav-item", isActive && "nav-item--active")
                }
              >
                Events
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  cn("nav-item", isActive && "nav-item--active")
                }
              >
                Gallery
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  cn("nav-item", isActive && "nav-item--active")
                }
              >
                Resources
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  cn("nav-item", isActive && "nav-item--active")
                }
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* CTA Buttons */}
        <div className="cta">
          <NavLink to="/auth/sign-in" className="btn btn--ghost">
            Sign In
          </NavLink>
          <NavLink to="/get-started" className="btn btn--primary">
            Get Started
          </NavLink>
        </div>
      </div>

      {/* ===== Mobile header (new) ===== */}
      <div className="md:hidden">
        <div className="flex h-14 items-center justify-between px-3">
          <div className="flex items-center mobile-header-container">
            <NavLink to="/" className="flex items-center gap-2" aria-label="Home">
              <div className="h-9 w-9 rounded-lg overflow-hidden shadow-medium bg-primary/20 flex items-center justify-center border border-primary/30">
                <img src={logo} alt="Table Tennis Saskatchewan" className="h-full w-full object-contain" />
              </div>
              <span className="text-base font-bold tracking-tight text-sm mobile-header-text">Table Tennis Saskatchewan</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/auth/sign-in"
              className="inline-flex h-9 items-center rounded-full bg-[var(--tt-green-vibrant)] px-3 text-sm font-semibold text-white hover:bg-[var(--tt-green-vibrant-dark)] transition-colors"
            >
              Log In
            </NavLink>
            <NavLink
              to="/get-started"
              className="inline-flex h-9 items-center rounded-full bg-[var(--tt-green-vibrant)] px-3 text-sm font-semibold text-white hover:bg-[var(--tt-green-vibrant-dark)] transition-colors"
            >
              Get Started
            </NavLink>
            <button
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              onClick={() => setMobileOpen(true)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
      </div>
    </header>
  );
}
