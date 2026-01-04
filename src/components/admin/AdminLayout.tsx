import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVerifier, setShowVerifier] = useState(false);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Force close on initial mount + Show Verifier for debugging
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowVerifier(true);
    const timer = setTimeout(() => setShowVerifier(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const closeMenu = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(false);
  };

  const openMenu = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(true);
  };

  return (
    <div className="min-h-screen bg-green-50 flex overflow-x-hidden relative">
      {/* Visual Build Verifier - Proof of Update */}
      {showVerifier && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white text-[10px] font-black py-1 text-center animate-pulse uppercase tracking-[0.3em]">
          UI Engine v2.1 Live - {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => closeMenu()}
      />

      {/* Sidebar - Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[70] lg:hidden w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-2">Navigation</span>
            <button
              type="button"
              onClick={(e) => closeMenu(e)}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all active:scale-90"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header - Clean top bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center h-16">
          <button
            type="button"
            className="lg:hidden ml-4 p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
            onClick={(e) => openMenu(e)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
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
