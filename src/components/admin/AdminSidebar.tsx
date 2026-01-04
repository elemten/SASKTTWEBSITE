import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { auth } from "@/lib/auth";
import logo from "@/assets/logo.png";

export const AdminSidebar = ({ isMobile, onNavigate }: { isMobile?: boolean; onNavigate?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const handleNavigate = (href: string) => {
    navigate(href);
    if (onNavigate) onNavigate();
  };

  return (
    <div className={cn(
      "h-full bg-white flex flex-col transition-all duration-300",
      isMobile ? "w-full" : (collapsed ? "w-16" : "w-64"),
      !isMobile && "border-r border-gray-100"
    )}>
      {/* Header - Hidden on mobile as drawer has its own */}
      {!isMobile && (
        <div className="px-4 py-5 border-b border-gray-100">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
              <img
                src={logo}
                alt="Table Tennis Saskatchewan logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500">Table Tennis Saskatchewan</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {ADMIN_NAV.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <button
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  // Base Apple-like styling
                  "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-left font-medium text-sm transition-all duration-200 ease-out",
                  "focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-1",

                  // Default state - subtle hover
                  location.pathname === item.href || (item.href === "/admin" && location.pathname === "/admin")
                    ? "text-emerald-700 font-bold"
                    : "text-gray-400 hover:text-gray-900 group-hover:translate-x-1",

                  // Apple-like hover effect - only on individual items
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                )}
                aria-current={location.pathname === item.href ? "page" : undefined}
              >
                {/* Active indicator - green pill behind content */}
                {(location.pathname === item.href || (item.href === "/admin" && location.pathname === "/admin")) && (
                  <motion.div
                    layoutId={isMobile ? "mobileActiveTab" : "activeTab"}
                    className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-100/50"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}

                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors duration-200 relative z-10",
                    location.pathname === item.href || (item.href === "/admin" && location.pathname === "/admin")
                      ? "text-emerald-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )}
                />

                {/* Label */}
                {(!collapsed || isMobile) && (
                  <span className={cn(
                    "truncate transition-colors duration-200 relative z-10 text-sm font-medium",
                    location.pathname === item.href || (item.href === "/admin" && location.pathname === "/admin")
                      ? "text-emerald-900 font-semibold"
                      : "text-gray-500"
                  )}>
                    {item.label}
                  </span>
                )}

                {/* Active dot indicator (Apple style) */}
                {(location.pathname === item.href || (item.href === "/admin" && location.pathname === "/admin")) && (!collapsed || isMobile) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full relative z-10"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sign Out - Bottom of Sidebar */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => {
            auth.signOut();
            navigate('/sign-in');
          }}
          className={cn(
            "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
            "text-red-500 hover:bg-red-50 active:scale-95",
            collapsed && !isMobile && "justify-center px-0"
          )}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="text-sm font-black italic uppercase tracking-wider">Sign Out</span>
          )}
        </button>
      </div>

      {/* Collapse Toggle - Hide on mobile */}
      {!isMobile && (
        <div className="px-3 py-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center h-8 px-2",
              "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              "transition-colors duration-200"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};