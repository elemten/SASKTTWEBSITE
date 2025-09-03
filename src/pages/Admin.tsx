import { useState, Suspense, lazy, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ADMIN_NAV, AdminSection } from "@/lib/admin-nav";
// AuthGuard removed for now - will be re-enabled when authentication is implemented
import { MembershipFallback, GenericFallback } from "@/components/admin/FallbackComponents";

// Lazy load heavy admin components with error handling
const DashboardOverview = lazy(() =>
  import("@/components/admin/DashboardOverview")
    .then(m => ({ default: m.DashboardOverview }))
    .catch(err => {
      console.error('Failed to load DashboardOverview:', err);
      return { default: () => <GenericFallback moduleName="Dashboard" /> };
    })
);
const MembersManagement = lazy(() =>
  import("@/components/admin/MembersManagement")
    .then(m => ({ default: m.MembersManagement }))
    .catch(err => {
      console.error('Failed to load MembersManagement:', err);
      return { default: () => <GenericFallback moduleName="Members" /> };
    })
);
const MembershipEnhancements = lazy(() =>
  import("@/components/admin/MembershipEnhancements")
    .then(m => ({ default: m.MembershipEnhancements }))
    .catch(err => {
      console.error('Failed to load MembershipEnhancements:', err);
      return { default: () => <MembershipFallback /> };
    })
);
const ClubsManagement = lazy(() =>
  import("@/components/admin/ClubsManagement")
    .then(m => ({ default: m.ClubsManagement }))
    .catch(err => {
      console.error('Failed to load ClubsManagement:', err);
      return { default: () => <GenericFallback moduleName="Clubs" /> };
    })
);
const InvoicesPayments = lazy(() =>
  import("@/components/admin/InvoicesPayments")
    .then(m => ({ default: m.InvoicesPayments }))
    .catch(err => {
      console.error('Failed to load InvoicesPayments:', err);
      return { default: () => <GenericFallback moduleName="Invoices" /> };
    })
);
const Events = lazy(() =>
  import("@/components/admin/Events")
    .then(m => ({ default: m.Events }))
    .catch(err => {
      console.error('Failed to load Events:', err);
      return { default: () => <GenericFallback moduleName="Events" /> };
    })
);
const TournamentsManagement = lazy(() =>
  import("@/components/admin/TournamentsManagement")
    .then(m => ({ default: m.TournamentsManagement }))
    .catch(err => {
      console.error('Failed to load TournamentsManagement:', err);
      return { default: () => <GenericFallback moduleName="Tournaments" /> };
    })
);
const ExpensesReimbursements = lazy(() =>
  import("@/components/admin/ExpensesReimbursements")
    .then(m => ({ default: m.ExpensesReimbursements }))
    .catch(err => {
      console.error('Failed to load ExpensesReimbursements:', err);
      return { default: () => <GenericFallback moduleName="Expenses" /> };
    })
);
const Reports = lazy(() =>
  import("@/components/admin/Reports")
    .then(m => ({ default: m.Reports }))
    .catch(err => {
      console.error('Failed to load Reports:', err);
      return { default: () => <GenericFallback moduleName="Reports" /> };
    })
);
const AdminsLogs = lazy(() =>
  import("@/components/admin/AdminsLogs")
    .then(m => ({ default: m.AdminsLogs }))
    .catch(err => {
      console.error('Failed to load AdminsLogs:', err);
      return { default: () => <GenericFallback moduleName="Admin Logs" /> };
    })
);



const Admin = () => {
  const navigate = useNavigate();
  
  // For now, redirect to coming soon page since authentication is not implemented
  // This will be removed when authentication is added back
  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);
  
  return null;

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
      case "membership":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <MembershipEnhancements />
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
      case "tournaments":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TournamentsManagement />
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
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-subtle grid grid-cols-[280px_1fr] lg:grid-cols-[260px_1fr] md:grid-cols-[280px_1fr]">
        {/* Sidebar - Fixed/Sticky */}
        <div className="sticky top-0 h-screen overflow-y-auto z-30 border-r border-border/50">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Header - Fixed at top with proper z-index */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
            <AdminTopBar />
          </div>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
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
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;