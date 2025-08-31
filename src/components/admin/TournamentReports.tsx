import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Target,
  Award,
  Clock,
  MapPin,
  Medal,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock tournament data for analytics
const tournamentAnalytics = {
  overview: {
    totalTournaments: 24,
    totalParticipants: 1250,
    totalRevenue: 87500,
    averageAttendance: 52,
    completionRate: 91.7,
    growthRate: 15.2
  },
  performance: {
    topPerforming: [
      { name: "Saskatchewan Open Championship", participants: 128, revenue: 6400, rating: 4.8 },
      { name: "Youth Provincial Qualifier", participants: 96, revenue: 2400, rating: 4.6 },
      { name: "Club Championship Series", participants: 144, revenue: 3600, rating: 4.4 }
    ],
    categoryBreakdown: [
      { category: "Open Singles", count: 8, participants: 320, revenue: 16000 },
      { category: "Open Doubles", count: 6, participants: 240, revenue: 12000 },
      { category: "Youth", count: 5, participants: 200, revenue: 10000 },
      { category: "Veterans", count: 3, participants: 120, revenue: 6000 },
      { category: "Club Teams", count: 2, participants: 80, revenue: 4000 }
    ]
  },
  financials: {
    revenueByMonth: [
      { month: "Jan", revenue: 5200, expenses: 1800, profit: 3400 },
      { month: "Feb", revenue: 6800, expenses: 2200, profit: 4600 },
      { month: "Mar", revenue: 7200, expenses: 2400, profit: 4800 },
      { month: "Apr", revenue: 5900, expenses: 2100, profit: 3800 },
      { month: "May", revenue: 8100, expenses: 2600, profit: 5500 },
      { month: "Jun", revenue: 9300, expenses: 2800, profit: 6500 }
    ],
    prizeDistribution: [
      { position: "1st Place", percentage: 40, amount: 2000 },
      { position: "2nd Place", percentage: 25, amount: 1250 },
      { position: "3rd Place", percentage: 15, amount: 750 },
      { position: "4th Place", percentage: 10, amount: 500 },
      { position: "5th-8th Place", percentage: 5, amount: 250 }
    ]
  },
  participantInsights: {
    demographics: {
      ageGroups: [
        { group: "Under 18", count: 320, percentage: 25.6 },
        { group: "18-30", count: 480, percentage: 38.4 },
        { group: "31-50", count: 320, percentage: 25.6 },
        { group: "Over 50", count: 130, percentage: 10.4 }
      ],
      skillLevels: [
        { level: "Beginner", count: 200, percentage: 16 },
        { level: "Intermediate", count: 500, percentage: 40 },
        { level: "Advanced", count: 400, percentage: 32 },
        { level: "Expert", count: 150, percentage: 12 }
      ]
    },
    retention: {
      returningPlayers: 68.5,
      newPlayers: 31.5,
      averageRating: 4.2
    }
  },
  venueAnalytics: [
    { venue: "Saskatoon Sports Centre", tournaments: 8, avgAttendance: 65, revenue: 32000 },
    { venue: "Regina Table Tennis Club", tournaments: 6, avgAttendance: 48, revenue: 24000 },
    { venue: "Moose Jaw Community Centre", tournaments: 5, avgAttendance: 42, revenue: 21000 },
    { venue: "Prince Albert Civic Centre", tournaments: 3, avgAttendance: 38, revenue: 18000 },
    { venue: "Yorkton Sports Complex", tournaments: 2, avgAttendance: 35, revenue: 16000 }
  ]
};

export function TournamentReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-year");
  const [selectedReport, setSelectedReport] = useState("overview");
  const { toast } = useToast();

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `${reportType} report is being generated and will download shortly.`,
    });

    setTimeout(() => {
      const csvContent = generateCSVContent(reportType);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `tournament_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: `Tournament ${reportType} report has been downloaded successfully.`,
      });
    }, 2000);
  };

  const generateCSVContent = (reportType: string) => {
    let headers = "";
    let data = "";

    switch (reportType) {
      case "financial-summary":
        headers = "Month,Revenue,Expenses,Profit\n";
        data = tournamentAnalytics.financials.revenueByMonth.map(item =>
          `${item.month},${item.revenue},${item.expenses},${item.profit}`
        ).join('\n');
        break;
      case "participant-demographics":
        headers = "Age Group,Count,Percentage\n";
        data = tournamentAnalytics.participantInsights.demographics.ageGroups.map(item =>
          `"${item.group}",${item.count},${item.percentage}%`
        ).join('\n');
        break;
      case "venue-performance":
        headers = "Venue,Tournaments,Avg Attendance,Revenue\n";
        data = tournamentAnalytics.venueAnalytics.map(item =>
          `"${item.venue}",${item.tournaments},${item.avgAttendance},${item.revenue}`
        ).join('\n');
        break;
      default:
        headers = "Category,Count,Participants,Revenue\n";
        data = tournamentAnalytics.performance.categoryBreakdown.map(item =>
          `"${item.category}",${item.count},${item.participants},${item.revenue}`
        ).join('\n');
    }

    return headers + data;
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
          <h1 className="text-3xl font-bold text-foreground">Tournament Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into tournament performance and participant engagement
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleExportReport("financial-summary")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentAnalytics.overview.totalTournaments}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{tournamentAnalytics.overview.growthRate}% vs last year
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentAnalytics.overview.totalParticipants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {tournamentAnalytics.overview.averageAttendance} per tournament
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tournamentAnalytics.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From entry fees and prizes
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentAnalytics.overview.completionRate}%</div>
            <Progress value={tournamentAnalytics.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedReport} onValueChange={setSelectedReport}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Tournaments */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournamentAnalytics.performance.topPerforming.map((tournament, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{tournament.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tournament.participants} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${tournament.revenue.toLocaleString()}</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{tournament.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournamentAnalytics.performance.categoryBreakdown.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.category}</span>
                      <div className="flex gap-4">
                        <span>{category.count} tournaments</span>
                        <span>${category.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress
                      value={(category.participants / tournamentAnalytics.overview.totalParticipants) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Venue Performance */}
          <Card className="glass border-border/50">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Venue Performance
              </CardTitle>
              <Button
                onClick={() => handleExportReport("venue-performance")}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue</TableHead>
                    <TableHead>Tournaments</TableHead>
                    <TableHead>Avg Attendance</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentAnalytics.venueAnalytics.map((venue, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{venue.venue}</TableCell>
                      <TableCell>{venue.tournaments}</TableCell>
                      <TableCell>{venue.avgAttendance}</TableCell>
                      <TableCell>${venue.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={venue.avgAttendance > 50 ? "default" : venue.avgAttendance > 40 ? "secondary" : "destructive"}>
                          {venue.avgAttendance > 50 ? "Excellent" : venue.avgAttendance > 40 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tournament Completion Rate */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Completion Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {tournamentAnalytics.overview.completionRate}%
                  </div>
                  <p className="text-muted-foreground mb-4">Tournaments completed successfully</p>
                  <Progress value={tournamentAnalytics.overview.completionRate} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Average Tournament Metrics */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Average Tournament Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Participants per tournament</span>
                  <span className="font-semibold">{tournamentAnalytics.overview.averageAttendance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Revenue per tournament</span>
                  <span className="font-semibold">
                    ${(tournamentAnalytics.overview.totalRevenue / tournamentAnalytics.overview.totalTournaments).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Duration (hours)</span>
                  <span className="font-semibold">6.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Satisfaction rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Monthly Revenue Chart */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Revenue & Expenses
                </span>
                <Button
                  onClick={() => handleExportReport("financial-summary")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentAnalytics.financials.revenueByMonth.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell className="text-right">${month.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${month.expenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        ${month.profit.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {((month.profit / month.revenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Prize Distribution */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Prize Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tournamentAnalytics.financials.prizeDistribution.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Medal className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{prize.position}</h4>
                        <p className="text-sm text-muted-foreground">{prize.percentage}% of prize pool</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${prize.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournamentAnalytics.participantInsights.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{group.group}</span>
                      <span>{group.count} participants ({group.percentage}%)</span>
                    </div>
                    <Progress value={group.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skill Level Distribution */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Skill Level Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tournamentAnalytics.participantInsights.demographics.skillLevels.map((level, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{level.level}</span>
                      <span>{level.count} participants ({level.percentage}%)</span>
                    </div>
                    <Progress value={level.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Participant Retention */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Participant Retention & Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {tournamentAnalytics.participantInsights.retention.returningPlayers}%
                  </div>
                  <div className="text-sm text-muted-foreground">Returning Players</div>
                  <div className="text-xs text-blue-600 mt-1">High retention rate</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {tournamentAnalytics.participantInsights.retention.newPlayers}%
                  </div>
                  <div className="text-sm text-muted-foreground">New Players</div>
                  <div className="text-xs text-green-600 mt-1">Growing community</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {tournamentAnalytics.participantInsights.retention.averageRating}/5
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="text-xs text-yellow-600 mt-1">Excellent feedback</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
