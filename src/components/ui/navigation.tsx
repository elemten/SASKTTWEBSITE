import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useState } from "react";
import {
  NavigationMenu as RadixNav,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";


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
    { href: "/rentals", label: "Equipment Rentals" },
    { href: "/coaching", label: "Coaching" },
    { href: "/officials", label: "Officials" },
  ] },
  { href: "/events", label: "Training", children: [
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
  return (
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
            <div className="h-12 w-12 rounded-full overflow-hidden shadow-medium bg-white flex items-center justify-center">
              <img src={logo} alt="Table Tennis Saskatchewan" className="h-full w-full object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Table Tennis Saskatchewan
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium leading-none">Official Association</p>
            </div>
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}