import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useState, useEffect } from "react";



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
      { href: "/about/staff-board", label: "Team Members" },
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

  useEffect(() => {
    // Close dropdowns on outside click
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.has-dropdown') && !target.closest('.dropdown')) {
        setOpenDropdown(null);
      }
    };

    // Close dropdowns on escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href);
  };

  return (
    <header className={cn("nav", className)}>
      <div className="nav__inner">
        {/* Brand Section */}
        <NavLink to="/" className="brand">
          <img
            className="brand__logo"
            src={logo}
            alt="Table Tennis Saskatchewan"
          />
          <div className="brand__text">
            <div className="brand__title">Table Tennis Saskatchewan</div>
            <div className="brand__sub">Official Association</div>
          </div>
        </NavLink>

        {/* Navigation Menu */}
        <nav className="primary" aria-label="primary">
          <ul className="primary__list">
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

            {/* About Us Dropdown */}
            <li className="has-dropdown">
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/about'}
                onClick={() => toggleDropdown('/about')}
              >
                About Us <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/about' && "dropdown--open"
                )}
                role="menu"
              >
                <NavLink to="/about/history-mission" className="dropdown__item">
                  History & Mission
                </NavLink>
                <NavLink to="/about/staff-board" className="dropdown__item">
                  Team Members
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
            <li className="has-dropdown">
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/membership'}
                onClick={() => toggleDropdown('/membership')}
              >
                Services <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/membership' && "dropdown--open"
                )}
                role="menu"
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
            <li className="has-dropdown">
              <button
                className="nav-item nav-item--trigger"
                aria-expanded={openDropdown === '/play/training'}
                onClick={() => toggleDropdown('/play/training')}
              >
                Training <span className="chev" />
              </button>
              <div
                className={cn(
                  "dropdown",
                  openDropdown === '/play/training' && "dropdown--open"
                )}
                role="menu"
              >
                <NavLink to="/play/training" className="dropdown__item">
                  Training Programs
                </NavLink>
                <NavLink to="/play/clinics" className="dropdown__item">
                  Clinics
                </NavLink>
                <NavLink to="/play/advanced-para" className="dropdown__item">
                  Advanced & Para
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
          <NavLink to="/membership" className="btn btn--primary">
            Get Started
          </NavLink>
        </div>
      </div>
    </header>
  );
}