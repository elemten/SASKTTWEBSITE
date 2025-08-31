import { motion } from "framer-motion";
import { Plus, User, Calendar, FileText, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const quickActions = [
  {
    id: "add-member",
    label: "Add Member",
    description: "Register a new member",
    icon: User,
    color: "bg-blue-500 hover:bg-blue-600",
    onClick: () => console.log("Add member clicked")
  },
  {
    id: "create-event",
    label: "Create Event",
    description: "Schedule a new event",
    icon: Calendar,
    color: "bg-green-500 hover:bg-green-600",
    onClick: () => console.log("Create event clicked")
  },
  {
    id: "new-invoice",
    label: "New Invoice",
    description: "Create an invoice",
    icon: Receipt,
    color: "bg-purple-500 hover:bg-purple-600",
    onClick: () => console.log("New invoice clicked")
  },
  {
    id: "export-data",
    label: "Export CSV",
    description: "Download data export",
    icon: Download,
    color: "bg-orange-500 hover:bg-orange-600",
    onClick: () => console.log("Export CSV clicked")
  }
];

export function QuickActions() {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <Plus className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={action.onClick}
              className={`w-full h-auto p-4 flex flex-col items-center gap-2 text-white ${action.color} transition-all duration-200`}
              variant="default"
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-90 mt-1">{action.description}</div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
