import { motion } from "framer-motion";
import { Users, UserX, FileText, Calendar, TrendingUp, TrendingDown, Plus, UserPlus, CalendarPlus, Download, Receipt, Trophy, Building2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const statsData = [
  {
    title: "Active Members",
    value: "342",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-success"
  },
  {
    title: "Expired Memberships",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: UserX,
    color: "text-warning"
  },
  {
    title: "Pending Invoices",
    value: "18",
    change: "+3%",
    trend: "up",
    icon: FileText,
    color: "text-destructive"
  },
  {
    title: "Upcoming Events",
    value: "7",
    change: "+2",
    trend: "up",
    icon: Calendar,
    color: "text-primary"
  }
];

const membershipData = [
  { month: 'Jan', members: 280 },
  { month: 'Feb', members: 295 },
  { month: 'Mar', members: 310 },
  { month: 'Apr', members: 325 },
  { month: 'May', members: 342 },
  { month: 'Jun', members: 358 }
];

const financialData = [
  { month: 'Jan', income: 12500, expenses: 8200 },
  { month: 'Feb', income: 13200, expenses: 8900 },
  { month: 'Mar', income: 14100, expenses: 9400 },
  { month: 'Apr', income: 13800, expenses: 8800 },
  { month: 'May', income: 15200, expenses: 9600 },
  { month: 'Jun', income: 16500, expenses: 10200 }
];

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExportCSV = () => {
    // Mock CSV export functionality
    toast({
      title: "Export Started",
      description: "CSV export has been initiated. Download will begin shortly.",
    });

    // Simulate export delay
    setTimeout(() => {
      const csvContent = "Name,Email,Status,Join Date\nJohn Doe,john@example.com,Active,2024-01-15\nJane Smith,jane@example.com,Active,2024-02-20";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "members_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: "Members data has been exported successfully.",
      });
    }, 2000);
  };

  const quickActions = [
    {
      label: "Add Member",
      icon: UserPlus,
      onClick: () => navigate('/admin/members/new'),
      color: "bg-blue-500 hover:bg-blue-600",
      ariaLabel: "Add a new member"
    },
    {
      label: "Create Tournament",
      icon: Trophy,
      onClick: () => navigate('/admin/tournaments/new'),
      color: "bg-purple-500 hover:bg-purple-600",
      ariaLabel: "Create a new tournament"
    },
    {
      label: "Register Club",
      icon: Building2,
      onClick: () => navigate('/admin/clubs/new'),
      color: "bg-green-500 hover:bg-green-600",
      ariaLabel: "Register a new club"
    },
    {
      label: "Monthly Report",
      icon: BarChart3,
      onClick: () => navigate('/admin/reports/monthly'),
      color: "bg-indigo-500 hover:bg-indigo-600",
      ariaLabel: "Generate monthly financial report"
    },
    {
      label: "Export Data",
      icon: Download,
      onClick: handleExportCSV,
      color: "bg-orange-500 hover:bg-orange-600",
      ariaLabel: "Export current data as CSV"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Admin
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with Table Tennis Saskatchewan today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">TTS</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3 justify-start"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={action.onClick}
              className={`flex items-center gap-2 px-4 py-2 h-auto rounded-full text-white font-medium shadow-sm transition-all duration-200 ${action.color}`}
              aria-label={action.ariaLabel}
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="glass hover:shadow-medium transition-all duration-300 hover:scale-[1.02] border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center`}>
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className={`text-sm flex items-center space-x-1 ${stat.color}`}>
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Simplified for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};