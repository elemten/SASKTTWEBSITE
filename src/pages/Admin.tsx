import { useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load heavy admin components
const DashboardOverview = lazy(() => import("@/components/admin/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const MembersManagement = lazy(() => import("@/components/admin/MembersManagement").then(m => ({ default: m.MembersManagement })));
const ClubsManagement = lazy(() => import("@/components/admin/ClubsManagement").then(m => ({ default: m.ClubsManagement })));
const InvoicesPayments = lazy(() => import("@/components/admin/InvoicesPayments").then(m => ({ default: m.InvoicesPayments })));
const EventsRentals = lazy(() => import("@/components/admin/EventsRentals").then(m => ({ default: m.EventsRentals })));
const ExpensesReimbursements = lazy(() => import("@/components/admin/ExpensesReimbursements").then(m => ({ default: m.ExpensesReimbursements })));
const Reports = lazy(() => import("@/components/admin/Reports").then(m => ({ default: m.Reports })));
const AdminsLogs = lazy(() => import("@/components/admin/AdminsLogs").then(m => ({ default: m.AdminsLogs })));

type AdminSection = 
  | "dashboard" 
  | "members" 
  | "clubs" 
  | "invoices" 
  | "events" 
  | "expenses" 
  | "reports" 
  | "admins";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const renderContent = () => {
    const contentVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    switch (activeSection) {
      case "dashboard":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardOverview />
          </Suspense>
        );
      case "members":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <MembersManagement />
          </Suspense>
        );
      case "clubs":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ClubsManagement />
          </Suspense>
        );
      case "invoices":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <InvoicesPayments />
          </Suspense>
        );
      case "events":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <EventsRentals />
          </Suspense>
        );
      case "expenses":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ExpensesReimbursements />
          </Suspense>
        );
      case "reports":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Reports />
          </Suspense>
        );
      case "admins":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminsLogs />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardOverview />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex w-full">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <div className="flex-1 flex flex-col">
            <AdminTopBar />
            
            <main className="flex-1 p-6">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;