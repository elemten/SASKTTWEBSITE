import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
// import logo from "@/assets/logo.png";

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
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-border/30 shadow-soft",
        "supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              mass: 0.8
            }}
            className="flex items-center space-x-4"
            style={{ willChange: 'transform' }}
          >
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
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
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
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          initial={false}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 25,
                            mass: 0.8
                          }}
                          style={{ willChange: 'transform' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
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