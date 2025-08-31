import { motion } from "framer-motion";
import { Clock, User, FileText, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock audit data
const auditActivities = [
  {
    id: 1,
    type: "user_created",
    description: "New member registered",
    user: "John Smith",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    icon: User,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 2,
    type: "invoice_paid",
    description: "Invoice #INV-2024-001 paid",
    user: "Sarah Johnson",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    icon: DollarSign,
    color: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    type: "event_created",
    description: "New tournament created",
    user: "Admin User",
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
    icon: Calendar,
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: 4,
    type: "club_updated",
    description: "Club information updated",
    user: "Mike Wilson",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    icon: FileText,
    color: "bg-orange-100 text-orange-800"
  },
  {
    id: 5,
    type: "system_alert",
    description: "Payment webhook failed",
    user: "System",
    timestamp: new Date(Date.now() - 62 * 60 * 1000), // 62 minutes ago
    icon: AlertCircle,
    color: "bg-red-100 text-red-800"
  },
  {
    id: 6,
    type: "user_login",
    description: "Admin login successful",
    user: "Admin User",
    timestamp: new Date(Date.now() - 78 * 60 * 1000), // 78 minutes ago
    icon: User,
    color: "bg-gray-100 text-gray-800"
  },
  {
    id: 7,
    type: "report_generated",
    description: "Monthly membership report",
    user: "Admin User",
    timestamp: new Date(Date.now() - 95 * 60 * 1000), // 95 minutes ago
    icon: FileText,
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    id: 8,
    type: "event_updated",
    description: "Tournament registration opened",
    user: "Sarah Johnson",
    timestamp: new Date(Date.now() - 112 * 60 * 1000), // 112 minutes ago
    icon: Calendar,
    color: "bg-teal-100 text-teal-800"
  }
];

const getTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export function AuditTrail() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4 space-y-3">
            {auditActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <activity.icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {activity.user}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
