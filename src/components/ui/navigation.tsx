import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";


interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/membership", label: "Membership" },
  { href: "/events", label: "Events & Training" },
  { href: "/rentals", label: "Equipment Rentals" },
  { href: "/about", label: "About" },
];

export function Navigation({ className }: NavigationProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b border-border/30",
        className
      )}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div 
                className="h-12 w-12 rounded-xl shadow-medium bg-primary flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">TTS</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Table Tennis Saskatchewan
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Official Association</p>
            </div>
                      </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <div key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-primary/5 hover:text-primary",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                      )}
                    </>
                  )}
                </NavLink>
              </div>
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
          </nav>
  );
}