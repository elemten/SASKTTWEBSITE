import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { ADMIN_NAV } from "@/lib/admin-nav";
import logo from "@/assets/logo.png";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}



export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentActiveSection = activeSection;

  return (
    <Sidebar className={cn(
      "glass border-r border-border/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="px-4 py-5 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
            <img
              src={logo}
              alt="Table Tennis Saskatchewan logo"
              className="w-full h-full object-contain"
            />
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
            "px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide transition-opacity duration-200",
            collapsed && "opacity-0"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 py-3">
            <SidebarMenu className="space-y-1">
              {ADMIN_NAV.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={currentActiveSection === item.id}
                      className={cn(
                        // Base styles for Apple-like button
                        "group relative w-full h-12 px-3 rounded-xl transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1",
                        // Default state
                        "text-neutral-700 hover:text-green-700 hover:bg-green-50",
                        // Active state - dark green pill
                        currentActiveSection === item.id && "bg-green-600 text-white shadow-sm",
                        // Respect reduced motion
                        "motion-reduce:transition-none motion-reduce:transform-none"
                      )}
                    >
                      <button
                        onClick={() => onSectionChange(item.id)}
                        className="w-full flex items-center gap-3 h-full"
                        aria-current={currentActiveSection === item.id ? "page" : undefined}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-all duration-200",
                          // Default state
                          "text-neutral-500 group-hover:text-green-700",
                          // Active state
                          currentActiveSection === item.id && "text-white",
                          // Respect reduced motion
                          "motion-reduce:transition-none motion-reduce:transform-none"
                        )} />
                        {!collapsed && (
                          <span className={cn(
                            "font-medium transition-all duration-200 truncate",
                            // Default state
                            "text-neutral-700 group-hover:text-green-700",
                            // Active state
                            currentActiveSection === item.id && "text-white",
                            // Respect reduced motion
                            "motion-reduce:transition-none"
                          )}>
                            {item.label}
                          </span>
                        )}
                        {/* Active indicator pill */}
                        {currentActiveSection === item.id && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-green-600 rounded-xl shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                              duration: 0.2
                            }}
                            style={{ zIndex: -1 }}
                          />
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

      <div className="px-4 py-3 border-t border-border/50">
        <SidebarTrigger className="w-full h-10" />
      </div>
    </Sidebar>
  );
};