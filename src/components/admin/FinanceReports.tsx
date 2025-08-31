import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  Receipt,
  Trophy,
  Users,
  Building2,
  BarChart3,
  Filter,
  Search,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Mock financial data
const monthlyData = {
  currentMonth: "March 2024",
  revenue: {
    memberships: 15200,
    tournaments: 8500,
    grants: 12500,
    clinics: 3200,
    merchandise: 1800,
    total: 41200
  },
  expenses: {
    venue: 6200,
    equipment: 3800,
    staff: 8500,
    marketing: 2200,
    insurance: 1200,
    supplies: 1800,
    total: 23700
  },
  netIncome: 17500,
  growthRate: 12.5
};

const grantTracking = [
  {
    id: 1,
    name: "MAP Grant - Equipment",
    recipient: "Saskatoon Table Tennis Club",
    amount: 2500,
    status: "approved",
    applicationDate: "2024-01-15",
    approvalDate: "2024-02-01",
    disbursementDate: "2024-02-15",
    purpose: "Purchase of training equipment"
  },
  {
    id: 2,
    name: "Tournament Support Grant",
    recipient: "Regina Table Tennis Association",
    amount: 5000,
    status: "pending",
    applicationDate: "2024-02-20",
    approvalDate: null,
    disbursementDate: null,
    purpose: "Youth tournament organization"
  },
  {
    id: 3,
    name: "MAP Grant - Facility Upgrade",
    recipient: "Moose Jaw Community Centre",
    amount: 8000,
    status: "approved",
    applicationDate: "2024-01-10",
    approvalDate: "2024-01-25",
    disbursementDate: "2024-02-10",
    purpose: "Facility improvements for accessibility"
  }
];

const revenueByCategory = [
  { category: "Memberships", amount: 15200, percentage: 36.9, trend: "up", change: 8.2 },
  { category: "Tournaments", amount: 8500, percentage: 20.6, trend: "up", change: 15.3 },
  { category: "Grants", amount: 12500, percentage: 30.3, trend: "up", change: 22.1 },
  { category: "Clinics", amount: 3200, percentage: 7.8, trend: "down", change: -2.4 },
  { category: "Merchandise", amount: 1800, percentage: 4.4, trend: "up", change: 5.7 }
];

const expensesByCategory = [
  { category: "Staff Salaries", amount: 8500, percentage: 35.9, trend: "up", change: 3.2 },
  { category: "Venue Rental", amount: 6200, percentage: 26.2, trend: "up", change: 8.1 },
  { category: "Equipment", amount: 3800, percentage: 16.0, trend: "down", change: -1.8 },
  { category: "Marketing", amount: 2200, percentage: 9.3, trend: "up", change: 12.4 },
  { category: "Insurance", amount: 1200, percentage: 5.1, trend: "up", change: 6.3 },
  { category: "Supplies", amount: 1800, percentage: 7.5, trend: "down", change: -4.2 }
];

export function FinanceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedReport, setSelectedReport] = useState("monthly");
  const { toast } = useToast();

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `${reportType} report is being generated and will download shortly.`,
    });

    // Simulate export delay
    setTimeout(() => {
      const csvContent = generateCSVContent(reportType);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: `${reportType} report has been downloaded successfully.`,
      });
    }, 2000);
  };

  const generateCSVContent = (reportType: string) => {
    let headers = "";
    let data = "";

    switch (reportType) {
      case "monthly-summary":
        headers = "Category,Revenue,Expenses,Net Income\n";
        data = revenueByCategory.map(cat => `${cat.category},${cat.amount},0,${cat.amount}`).join('\n') + '\n' +
               expensesByCategory.map(cat => `${cat.category},0,${cat.amount},${-cat.amount}`).join('\n');
        break;
      case "grant-tracking":
        headers = "Grant Name,Recipient,Amount,Status,Application Date,Approval Date,Disbursement Date,Purpose\n";
        data = grantTracking.map(grant =>
          `"${grant.name}","${grant.recipient}",${grant.amount},"${grant.status}","${grant.applicationDate}","${grant.approvalDate || ''}","${grant.disbursementDate || ''}","${grant.purpose}"`
        ).join('\n');
        break;
      case "yearly-summary":
        headers = "Month,Revenue,Expenses,Net Income,Growth Rate\n";
        data = "March 2024,41200,23700,17500,12.5\nFebruary 2024,36500,21800,14700,8.2\nJanuary 2024,34800,21200,13600,10.1";
        break;
      default:
        headers = "Category,Amount,Percentage,Change\n";
        data = revenueByCategory.map(cat => `${cat.category},${cat.amount},${cat.percentage}%,${cat.change}%`).join('\n');
    }

    return headers + data;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive financial overview and automated reporting
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleExportReport("monthly-summary")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${monthlyData.revenue.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{monthlyData.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${monthlyData.expenses.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Operating costs this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${monthlyData.netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit margin: {((monthlyData.netIncome / monthlyData.revenue.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {grantTracking.filter(g => g.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              ${grantTracking.filter(g => g.status === 'approved').reduce((sum, g) => sum + g.amount, 0).toLocaleString()} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different report types */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
          <TabsTrigger value="grants">Grant Tracking</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {revenueByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                        <Badge variant={item.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expenses Breakdown */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expensesByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                        <Badge variant={item.trend === 'up' ? 'destructive' : 'secondary'} className="text-xs">
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Detailed Financial Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByCategory.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right text-green-600">${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.trend === 'up' ? 'default' : 'secondary'}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {expensesByCategory.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">-${item.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.trend === 'up' ? 'destructive' : 'secondary'}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">${monthlyData.revenue.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${monthlyData.expenses.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${monthlyData.netIncome.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge>+{monthlyData.growthRate}%</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grants" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grant Tracking & Applications
              </CardTitle>
              <Button
                onClick={() => handleExportReport("grant-tracking")}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Grants
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grant Name</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Disbursement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grantTracking.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell className="font-medium">{grant.name}</TableCell>
                      <TableCell>{grant.recipient}</TableCell>
                      <TableCell>${grant.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(grant.status)}</TableCell>
                      <TableCell>{new Date(grant.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {grant.disbursementDate
                          ? new Date(grant.disbursementDate).toLocaleDateString()
                          : "Pending"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Approved Grants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {grantTracking.filter(g => g.status === 'approved').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${grantTracking.filter(g => g.status === 'approved').reduce((sum, g) => sum + g.amount, 0).toLocaleString()} total
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {grantTracking.filter(g => g.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Grant Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${(grantTracking.reduce((sum, g) => sum + g.amount, 0) / grantTracking.length).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per approved grant
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Yearly Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$124,500</div>
                    <div className="text-sm text-muted-foreground">Total Revenue YTD</div>
                    <div className="text-xs text-green-600 mt-1">+15.2% vs last year</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">$67,200</div>
                    <div className="text-sm text-muted-foreground">Total Expenses YTD</div>
                    <div className="text-xs text-red-600 mt-1">+8.7% vs last year</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$57,300</div>
                    <div className="text-sm text-muted-foreground">Net Income YTD</div>
                    <div className="text-xs text-blue-600 mt-1">+22.1% vs last year</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => handleExportReport("yearly-summary")}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Full Yearly Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
