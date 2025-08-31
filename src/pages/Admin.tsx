import { useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ADMIN_NAV, AdminSection } from "@/lib/admin-nav";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Lazy load heavy admin components
const DashboardOverview = lazy(() => import("@/components/admin/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const MembersManagement = lazy(() => import("@/components/admin/MembersManagement").then(m => ({ default: m.MembersManagement })));
const ClubsManagement = lazy(() => import("@/components/admin/ClubsManagement").then(m => ({ default: m.ClubsManagement })));
const InvoicesPayments = lazy(() => import("@/components/admin/InvoicesPayments").then(m => ({ default: m.InvoicesPayments })));
const Events = lazy(() => import("@/components/admin/Events").then(m => ({ default: m.Events })));
const ExpensesReimbursements = lazy(() => import("@/components/admin/ExpensesReimbursements").then(m => ({ default: m.ExpensesReimbursements })));
const Reports = lazy(() => import("@/components/admin/Reports").then(m => ({ default: m.Reports })));
const AdminsLogs = lazy(() => import("@/components/admin/AdminsLogs").then(m => ({ default: m.AdminsLogs })));



const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const renderContentSwitch = () => {
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
            <Events />
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
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-subtle">
          <AdminTopBar />
          <div className="flex">
            <AdminSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <main className="flex-1 p-8">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  {renderContentSwitch()}
                </Suspense>
              </motion.div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default Admin;