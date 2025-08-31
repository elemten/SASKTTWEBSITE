import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  Bell,
  Filter,
  Search,
  UserPlus,
  UserX,
  Award,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for member lifecycle
const memberLifecycle = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    club: "Saskatoon TTC",
    status: "active",
    joinDate: "2023-01-15",
    lastRenewal: "2024-01-15",
    expiryDate: "2025-01-15",
    membershipType: "Annual",
    totalPaid: 1350,
    tournamentsPlayed: 8,
    rating: 1650
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    club: "Regina Table Tennis",
    status: "expiring-soon",
    joinDate: "2023-06-20",
    lastRenewal: "2024-01-20",
    expiryDate: "2024-04-20",
    membershipType: "Annual",
    totalPaid: 900,
    tournamentsPlayed: 5,
    rating: 1420
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    club: "Moose Jaw TTC",
    status: "lapsed",
    joinDate: "2022-09-10",
    lastRenewal: "2023-09-10",
    expiryDate: "2024-01-10",
    membershipType: "Annual",
    totalPaid: 1800,
    tournamentsPlayed: 12,
    rating: 1780
  }
];

// Mock data for club health
const clubHealthData = [
  {
    id: 1,
    name: "Saskatoon Table Tennis Club",
    members: 45,
    activeMembers: 42,
    membershipRevenue: 20250,
    tournamentRevenue: 3200,
    grantStatus: "approved",
    lastTournament: "2024-02-15",
    healthScore: 95,
    status: "healthy",
    growth: 12.5,
    retention: 93.3
  },
  {
    id: 2,
    name: "Regina Table Tennis Association",
    members: 32,
    activeMembers: 28,
    membershipRevenue: 14400,
    tournamentRevenue: 1800,
    grantStatus: "pending",
    lastTournament: "2024-01-25",
    healthScore: 78,
    status: "attention",
    growth: 6.2,
    retention: 87.5
  },
  {
    id: 3,
    name: "Moose Jaw Community Table Tennis",
    members: 28,
    activeMembers: 22,
    membershipRevenue: 12600,
    tournamentRevenue: 1200,
    grantStatus: "none",
    lastTournament: "2023-12-10",
    healthScore: 65,
    status: "inactive",
    growth: -2.1,
    retention: 78.6
  }
];

const lifecycleStats = {
  totalMembers: 342,
  activeMembers: 315,
  expiringSoon: 18,
  lapsed: 9,
  newThisMonth: 12,
  renewalRate: 89.2,
  averageRetention: 84.5
};

export function MembershipEnhancements() {
  const [selectedTab, setSelectedTab] = useState("lifecycle");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expiring-soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case "lapsed":
        return <Badge className="bg-red-100 text-red-800">Lapsed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getClubHealthBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case "attention":
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredMembers = memberLifecycle.filter(member => {
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.club.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
          <h1 className="text-3xl font-bold text-foreground">Membership Management</h1>
          <p className="text-muted-foreground mt-1">
            Track member lifecycle, monitor club health, and manage renewals
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Member
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lifecycleStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              +{lifecycleStats.newThisMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lifecycleStats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {((lifecycleStats.activeMembers / lifecycleStats.totalMembers) * 100).toFixed(1)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lifecycleStats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              Need renewal reminders
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lifecycleStats.renewalRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 12 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lifecycle">Member Lifecycle</TabsTrigger>
          <TabsTrigger value="clubs">Club Health</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle" className="space-y-6">
          {/* Filters */}
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members by name, email, or club..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                    <SelectItem value="lapsed">Lapsed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Member Lifecycle Table */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Member Lifecycle Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{member.club}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>{new Date(member.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            getDaysUntilExpiry(member.expiryDate) < 0 ? 'text-red-600' :
                            getDaysUntilExpiry(member.expiryDate) < 30 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getDaysUntilExpiry(member.expiryDate) < 0 ?
                              `${Math.abs(getDaysUntilExpiry(member.expiryDate))} days overdue` :
                              `${getDaysUntilExpiry(member.expiryDate)} days`
                            }
                          </span>
                          {getDaysUntilExpiry(member.expiryDate) < 30 && getDaysUntilExpiry(member.expiryDate) > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.rating}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bell className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="clubs" className="space-y-6">
          {/* Club Health Overview */}
          <div className="grid gap-6">
            {clubHealthData.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{club.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          {getClubHealthBadge(club.status)}
                          <span className="text-sm text-muted-foreground">
                            {club.activeMembers}/{club.members} active members
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{club.healthScore}/100</div>
                        <div className="text-sm text-muted-foreground">Health Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Membership Revenue</div>
                        <div className="text-lg font-semibold">${club.membershipRevenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tournament Revenue</div>
                        <div className="text-lg font-semibold">${club.tournamentRevenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                        <div className={`text-lg font-semibold ${
                          club.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {club.growth >= 0 ? '+' : ''}{club.growth}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Retention Rate</div>
                        <div className="text-lg font-semibold">{club.retention}%</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Health Score</span>
                          <span>{club.healthScore}%</span>
                        </div>
                        <Progress value={club.healthScore} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Grant Status: {club.grantStatus}</span>
                        <span>Last Tournament: {new Date(club.lastTournament).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Message
                      </Button>
                      <Button variant="outline" size="sm">
                        Grant Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
