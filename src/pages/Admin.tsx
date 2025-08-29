import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { MembersManagement } from "@/components/admin/MembersManagement";
import { ClubsManagement } from "@/components/admin/ClubsManagement";
import { InvoicesPayments } from "@/components/admin/InvoicesPayments";
import { EventsRentals } from "@/components/admin/EventsRentals";
import { ExpensesReimbursements } from "@/components/admin/ExpensesReimbursements";
import { Reports } from "@/components/admin/Reports";
import { AdminsLogs } from "@/components/admin/AdminsLogs";
import { SidebarProvider } from "@/components/ui/sidebar";

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
        return <DashboardOverview />;
      case "members":
        return <MembersManagement />;
      case "clubs":
        return <ClubsManagement />;
      case "invoices":
        return <InvoicesPayments />;
      case "events":
        return <EventsRentals />;
      case "expenses":
        return <ExpensesReimbursements />;
      case "reports":
        return <Reports />;
      case "admins":
        return <AdminsLogs />;
      default:
        return <DashboardOverview />;
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