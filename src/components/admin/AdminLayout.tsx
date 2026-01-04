import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { X, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Bulletproof state: Start FALSE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 2. Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-green-50 flex overflow-x-hidden relative">

      {/* Sidebar - Desktop (Static) */}
      <div className="hidden lg:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile (CONDITIONAL RENDERING - Bulletproof) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-2">Navigation Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AdminSidebar isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Version identifier at bottom of mobile drawer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <p className="text-[8px] font-mono text-gray-400 text-center">MOBILE ENGINE v3.0 LIVE</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header - Clean top bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center h-16 flex-shrink-0">
          {!isMobileMenuOpen && (
            <button
              type="button"
              className="lg:hidden ml-4 p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
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
