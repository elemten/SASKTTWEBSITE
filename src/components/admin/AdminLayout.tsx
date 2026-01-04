import { ReactNode, useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { X, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-green-50 flex overflow-x-hidden relative">

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] px-2">Navigation</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative">

        {/* Mobile Menu Trigger - Floating & Minimal */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            type="button"
            className="p-3 bg-white/80 backdrop-blur-md shadow-lg border border-emerald-100 text-emerald-600 rounded-2xl transition-all active:scale-90"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-12 bg-green-50 pt-16 lg:pt-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
