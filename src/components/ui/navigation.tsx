import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useState, useEffect } from "react";
import {
  NavigationMenu as RadixNav,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { X } from "lucide-react";


interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us", children: [
    { href: "/about/history-mission", label: "History & Mission" },
    { href: "/about/staff-board", label: "Team Members" },
    { href: "/about/governance", label: "Governance" },
    { href: "/about", label: "Our Story" },
  ] },
  { href: "/membership", label: "Services", children: [
    { href: "/membership", label: "Membership" },
    { href: "/coaching", label: "Coaching" },
    { href: "/officials", label: "Officials" },
  ] },
  { href: "/play/training", label: "Training", children: [
    { href: "/play/training", label: "Training Programs" },
    { href: "/play/clinics", label: "Clinics" },
    { href: "/play/advanced-para", label: "Advanced & Para" },
    { href: "/play/locations", label: "Where to Play" },
  ] },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export function Navigation({ className }: NavigationProps) {
  const [openIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Scroll lock functionality
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      setSavedScrollPosition(window.scrollY);

      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling and position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      window.scrollTo(0, savedScrollPosition);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen, savedScrollPosition]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-border/30 font-sora",
        "supports-[backdrop-filter]:bg-white/70",
        className
      )}
    >
      <div className="container mx-auto px-6 py-2">
        <div className="h-16 flex items-center justify-between gap-8">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-4"
          >
            <NavLink to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="h-12 w-12 rounded-full overflow-hidden shadow-medium bg-white flex items-center justify-center">
                <img src={logo} alt="Table Tennis Saskatchewan" className="h-full w-full object-contain" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Table Tennis Saskatchewan
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium leading-none">Official Association</p>
              </div>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center" role="navigation" aria-label="Primary">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{ willChange: 'transform, opacity' }}
              >
                {item.children ? (
                  <RadixNav>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="px-3 py-2 text-[15px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 text-primary hover:bg-primary/5 hover:text-primary">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-[260px] p-2">
                          <div className="grid gap-1 p-1">
                            {item.children.map((child) => (
                              <NavLink key={child.href} to={child.href} className="rounded-md px-3 py-2 text-[15px] hover:bg-primary/5 hover:text-primary">
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </RadixNav>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "relative px-3 py-2 text-[15px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
                        "text-primary hover:text-primary hover:bg-primary/5"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>

                      </>
                    )}
                  </NavLink>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              onClick={() => window.location.href = '/auth/sign-in'}
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-medium hover:shadow-strong transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-muted/50"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </Button>
        </div>
      </div>
    </motion.nav>

    {/* Mobile Drawer */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="fixed top-0 left-0 right-0 bg-white shadow-xl rounded-b-2xl z-50 md:hidden"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              maxHeight: '100vh',
              overflowY: 'auto'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <NavLink
                to="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                onClick={closeMobileMenu}
              >
                <div className="h-10 w-10 rounded-full overflow-hidden shadow-medium bg-white flex items-center justify-center">
                  <img src={logo} alt="Table Tennis Saskatchewan" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Table Tennis Saskatchewan
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-medium leading-none">Official Association</p>
                </div>
              </NavLink>

              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="p-2 hover:bg-muted/50"
                aria-label="Close mobile menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-8 space-y-6">
              {/* Main Navigation */}
              <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {item.children ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {item.label}
                        </div>
                        {item.children.map((child, childIndex) => (
                          <motion.div
                            key={child.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.05) + (childIndex * 0.03), duration: 0.3 }}
                          >
                            <NavLink
                              to={child.href}
                              onClick={closeMobileMenu}
                              className={({ isActive }) =>
                                cn(
                                  "block px-4 py-3 text-base rounded-lg transition-colors min-h-[44px] flex items-center",
                                  isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                                )
                              }
                            >
                              {child.label}
                            </NavLink>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <NavLink
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          cn(
                            "block px-4 py-3 text-base rounded-lg transition-colors min-h-[44px] flex items-center font-medium",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-primary/5 hover:text-primary"
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Sign In Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="pt-4 border-t border-border/30"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mb-3"
                  onClick={() => {
                    closeMobileMenu();
                    window.location.href = '/auth/sign-in';
                  }}
                >
                  Sign In
                </Button>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-medium hover:shadow-strong transition-all duration-200 min-h-[48px]"
                  onClick={() => {
                    closeMobileMenu();
                    window.location.href = '/membership';
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}