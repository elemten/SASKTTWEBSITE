import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-green-50 flex">
      {/* Sidebar - Fixed/Sticky with Apple-like design */}
      <div className="flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - Clean top bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-200">
          <AdminTopBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-green-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
