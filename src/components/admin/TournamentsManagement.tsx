import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trophy, Calendar, Users, DollarSign, Filter, Search, MoreHorizontal, Eye, Edit, Trash2, Play, CheckCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TournamentWizard } from "./TournamentWizard";
import { TournamentReports } from "./TournamentReports";
import { ParticipantManagement } from "./ParticipantManagement";

// Mock tournament data
const mockTournaments = [
  {
    id: 1,
    name: "Saskatchewan Open Championship 2024",
    date: "2024-03-15",
    venue: "Saskatoon Sports Centre",
    status: "upcoming",
    participants: 64,
    maxParticipants: 128,
    categories: ["Open Singles", "Open Doubles", "Youth"],
    registrationFee: 50,
    prizePool: 2500,
    format: "Single Elimination",
    organizer: "TTS Sask",
    description: "Annual provincial championship featuring top players from across Saskatchewan."
  },
  {
    id: 2,
    name: "Youth Provincial Qualifier",
    date: "2024-02-10",
    venue: "Regina Table Tennis Club",
    status: "completed",
    participants: 32,
    maxParticipants: 32,
    categories: ["U18 Boys", "U18 Girls", "U15 Mixed"],
    registrationFee: 25,
    prizePool: 800,
    format: "Round Robin",
    organizer: "TTS Sask",
    description: "Qualifying tournament for youth players seeking national team selection."
  },
  {
    id: 3,
    name: "Club Championship Series - Round 1",
    date: "2024-01-20",
    venue: "Moose Jaw Community Centre",
    status: "in-progress",
    participants: 48,
    maxParticipants: 64,
    categories: ["Club Teams", "Individual"],
    registrationFee: 30,
    prizePool: 1200,
    format: "Double Elimination",
    organizer: "TTS Sask",
    description: "First round of the annual club championship series."
  }
];

const tournamentStats = {
  total: 12,
  upcoming: 5,
  inProgress: 2,
  completed: 5,
  totalRevenue: 15420,
  totalParticipants: 423
};

export function TournamentsManagement() {
  const [activeTab, setActiveTab] = useState("tournaments");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredTournaments = mockTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
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
          <h1 className="text-3xl font-bold text-foreground">Tournament Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track table tennis tournaments across Saskatchewan
          </p>
        </div>
        {activeTab === "tournaments" && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Tournament
          </Button>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentStats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Across all tournaments
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tournamentStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tournamentStats.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              Next: Saskatchewan Open
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tournaments by name or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tournament List */}
      <div className="grid gap-6">
        {filteredTournaments.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border/50 hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">{tournament.name}</h3>
                      {getStatusBadge(tournament.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(tournament.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{tournament.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{tournament.participants}/{tournament.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>${tournament.registrationFee} entry fee</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {tournament.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {tournament.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">Format:</span> {tournament.format}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Prize Pool:</span> ${tournament.prizePool.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Organizer:</span> {tournament.organizer}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tournament
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Participants
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trophy className="h-4 w-4 mr-2" />
                        View Brackets
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Tournament
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Tournament Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
          </DialogHeader>
          <TournamentWizard
            onComplete={() => {
              setShowCreateDialog(false);
              // Here you could refresh the tournament list
            }}
          />
        </DialogContent>
      </Dialog>
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantManagement />
        </TabsContent>

        <TabsContent value="reports">
          <TournamentReports />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
