import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close sidebar on any route change (handles hardware back button too)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-green-50 flex overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden w-72 bg-white shadow-2xl transition-transform duration-300 transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest px-2">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-emerald-600 rounded-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header - Clean top bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-4 text-emerald-600 rounded-xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <AdminTopBar />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-10 bg-green-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
