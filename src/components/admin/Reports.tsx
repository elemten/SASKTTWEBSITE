import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar, BarChart3, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const availableReports = [
  {
    id: "R001",
    name: "Monthly Membership Report",
    type: "Membership",
    period: "November 2024",
    generatedDate: "2024-12-01",
    format: "PDF",
    size: "2.3 MB"
  },
  {
    id: "R002", 
    name: "Financial Summary Q4",
    type: "Financial",
    period: "Q4 2024",
    generatedDate: "2024-11-30",
    format: "Excel",
    size: "1.8 MB"
  },
  {
    id: "R003",
    name: "Club Registration Status",
    type: "Clubs",
    period: "2024",
    generatedDate: "2024-11-28",
    format: "PDF",
    size: "1.2 MB"
  }
];

const membershipTrendData = [
  { month: 'Jan', active: 280, expired: 45, new: 32 },
  { month: 'Feb', active: 295, expired: 38, new: 28 },
  { month: 'Mar', active: 310, expired: 42, new: 35 },
  { month: 'Apr', active: 325, expired: 35, new: 40 },
  { month: 'May', active: 342, expired: 28, new: 45 },
  { month: 'Jun', active: 358, expired: 31, new: 38 }
];

const revenueData = [
  { month: 'Jan', membership: 8500, events: 2200, rentals: 1800 },
  { month: 'Feb', membership: 9200, events: 1900, rentals: 2100 },
  { month: 'Mar', membership: 10100, events: 2800, rentals: 2200 },
  { month: 'Apr', membership: 9800, events: 2400, rentals: 1600 },
  { month: 'May', membership: 11200, events: 2900, rentals: 2100 },
  { month: 'Jun', membership: 12500, events: 3200, rentals: 1800 }
];

const clubDistributionData = [
  { name: 'Regina', value: 8, color: 'hsl(var(--primary))' },
  { name: 'Saskatoon', value: 6, color: 'hsl(var(--secondary))' },
  { name: 'Prince Albert', value: 3, color: 'hsl(var(--accent))' },
  { name: 'Other', value: 4, color: 'hsl(var(--muted))' }
];

export const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("all");

  const filteredReports = availableReports.filter(report => {
    const matchesType = reportType === "all" || report.type.toLowerCase() === reportType;
    return matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "membership":
        return "bg-primary text-primary-foreground";
      case "financial":
        return "bg-success text-success-foreground";
      case "clubs":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and view detailed analytics reports</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Trends */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membership Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={membershipTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Active"
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="New"
                />
                <Line 
                  type="monotone" 
                  dataKey="expired" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  name="Expired"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="membership" fill="hsl(var(--primary))" name="Membership" />
                <Bar dataKey="events" fill="hsl(var(--success))" name="Events" />
                <Bar dataKey="rentals" fill="hsl(var(--secondary))" name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Club Distribution */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle>Club Distribution by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clubDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {clubDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Reports</CardTitle>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="clubs">Clubs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>{report.generatedDate}</TableCell>
                  <TableCell>{report.format}</TableCell>
                  <TableCell className="text-muted-foreground">{report.size}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};