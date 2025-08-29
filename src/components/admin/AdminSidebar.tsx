import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Calendar, 
  Receipt, 
  BarChart3, 
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
  },
  {
    id: "clubs",
    label: "Clubs",
    icon: Building2,
  },
  {
    id: "invoices",
    label: "Invoices & Payments",
    icon: FileText,
  },
  {
    id: "events",
    label: "Events & Rentals",
    icon: Calendar,
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: Receipt,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    id: "admins",
    label: "Admins & Logs",
    icon: Shield,
  },
];

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={cn(
      "glass border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TTS</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Table Tennis Saskatchewan</p>
            </div>
          )}
        </motion.div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "transition-opacity duration-200",
            collapsed && "opacity-0"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === item.id}
                      className={cn(
                        "group transition-all duration-200 hover:bg-accent hover:scale-[1.02]",
                        activeSection === item.id && "bg-primary text-primary-foreground shadow-medium"
                      )}
                    >
                      <button
                        onClick={() => onSectionChange(item.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg"
                      >
                        <item.icon className={cn(
                          "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                          activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                        {!collapsed && (
                          <span className={cn(
                            "font-medium transition-colors duration-200",
                            activeSection === item.id ? "text-primary-foreground" : "text-foreground"
                          )}>
                            {item.label}
                          </span>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-border/50">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
};