import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Users,
  Trophy,
  Shuffle,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit,
  Crown,
  Medal,
  Award,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock participant data
const mockParticipants = [
  { id: 1, name: "John Smith", email: "john@example.com", rating: 1650, club: "Saskatoon TTC", status: "registered" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", rating: 1420, club: "Regina Table Tennis", status: "registered" },
  { id: 3, name: "Mike Wilson", email: "mike@example.com", rating: 1780, club: "Moose Jaw TTC", status: "registered" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", rating: 1520, club: "Saskatoon TTC", status: "registered" },
  { id: 5, name: "Alex Chen", email: "alex@example.com", rating: 1680, club: "Regina Table Tennis", status: "registered" },
  { id: 6, name: "Lisa Brown", email: "lisa@example.com", rating: 1450, club: "Moose Jaw TTC", status: "registered" },
  { id: 7, name: "David Lee", email: "david@example.com", rating: 1600, club: "Prince Albert TTC", status: "registered" },
  { id: 8, name: "Maria Garcia", email: "maria@example.com", rating: 1550, club: "Yorkton TTC", status: "registered" }
];

const bracketTypes = [
  { id: "single-elimination", name: "Single Elimination", description: "Winner advances, loser eliminated" },
  { id: "double-elimination", name: "Double Elimination", description: "Two chances to lose before elimination" },
  { id: "round-robin", name: "Round Robin", description: "Each player plays every other player" },
  { id: "pool-play", name: "Pool Play", description: "Divided into pools, then elimination" }
];

// Draggable participant component
const DraggableParticipant = ({ participant, index, moveParticipant }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: "participant",
    item: { id: participant.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "participant",
    hover: (item: any) => {
      if (item.index !== index) {
        moveParticipant(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`p-3 bg-card rounded-lg border border-border cursor-move hover:shadow-sm transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{index + 1}</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {participant.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{participant.name}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{participant.club}</span>
            <Badge variant="outline" className="text-xs">
              {participant.rating}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            participant.status === 'registered' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
        </div>
      </div>
    </motion.div>
  );
};

// Bracket match component
const BracketMatch = ({ match, round, matchIndex }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: matchIndex * 0.1 }}
    className="relative"
  >
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <Badge variant="outline" className="text-xs">
            Round {round}, Match {matchIndex + 1}
          </Badge>
        </div>

        <div className="space-y-2">
          {match.players.map((player: any, index: number) => (
            <div
              key={index}
              className={`p-2 rounded border ${
                match.winner === index
                  ? 'bg-green-50 border-green-200'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{player.name}</span>
                {match.winner === index && <Crown className="h-4 w-4 text-green-600" />}
              </div>
              <div className="text-xs text-muted-foreground">{player.score || "0"}</div>
            </div>
          ))}
        </div>

        {match.status === 'completed' && (
          <div className="mt-3 text-center">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export function ParticipantManagement() {
  const [participants, setParticipants] = useState(mockParticipants);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bracketType, setBracketType] = useState("single-elimination");
  const [tournamentStatus, setTournamentStatus] = useState("setup");
  const [activeTab, setActiveTab] = useState("participants");

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.club.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || participant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const moveParticipant = useCallback((fromIndex: number, toIndex: number) => {
    setParticipants(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  const generateBracket = () => {
    // Simple bracket generation logic
    const numPlayers = participants.length;
    if (numPlayers < 2) return;

    setTournamentStatus("in-progress");
    // Bracket generation logic would go here
  };

  const shuffleParticipants = () => {
    setParticipants(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const sortByRating = () => {
    setParticipants(prev => [...prev].sort((a, b) => b.rating - a.rating));
  };

  // Mock bracket data for single elimination
  const mockBracket = [
    {
      round: 1,
      matches: [
        {
          id: 1,
          players: [
            { name: "John Smith", score: "11-9" },
            { name: "Sarah Johnson", score: "9-11" }
          ],
          winner: 0,
          status: "completed"
        },
        {
          id: 2,
          players: [
            { name: "Mike Wilson", score: "11-7" },
            { name: "Emma Davis", score: "7-11" }
          ],
          winner: 0,
          status: "completed"
        }
      ]
    },
    {
      round: 2,
      matches: [
        {
          id: 3,
          players: [
            { name: "John Smith", score: "11-8" },
            { name: "Mike Wilson", score: "8-11" }
          ],
          winner: 0,
          status: "completed"
        }
      ]
    }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Participant Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage tournament participants and generate brackets
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={`${
                tournamentStatus === 'setup' ? 'bg-blue-100 text-blue-800' :
                tournamentStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {tournamentStatus === 'setup' ? 'Setup Phase' :
               tournamentStatus === 'in-progress' ? 'Tournament Running' :
               'Completed'}
            </Badge>
            <Button onClick={generateBracket} disabled={participants.length < 2}>
              <Trophy className="h-4 w-4 mr-2" />
              Generate Bracket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participants.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered players
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(participants.reduce((sum, p) => sum + p.rating, 0) / participants.length)}
              </div>
              <p className="text-xs text-muted-foreground">
                Tournament strength
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clubs Represented</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(participants.map(p => p.club)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different clubs
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bracket Type</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {bracketTypes.find(b => b.id === bracketType)?.name}
              </div>
              <p className="text-xs text-muted-foreground">
                {bracketTypes.find(b => b.id === bracketType)?.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
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
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shuffleParticipants}>
                  <Shuffle className="h-4 w-4 mr-1" />
                  Shuffle
                </Button>
                <Button variant="outline" size="sm" onClick={sortByRating}>
                  <Target className="h-4 w-4 mr-1" />
                  Sort by Rating
                </Button>
              </div>
            </div>

            {/* Participants List */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tournament Participants
                  <Badge variant="secondary">{filteredParticipants.length} players</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredParticipants.map((participant, index) => (
                    <DraggableParticipant
                      key={participant.id}
                      participant={participant}
                      index={index}
                      moveParticipant={moveParticipant}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bracket" className="space-y-6">
            {tournamentStatus === 'setup' ? (
              <Card className="glass border-border/50">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bracket Not Generated</h3>
                  <p className="text-muted-foreground mb-6">
                    Add participants and click "Generate Bracket" to create the tournament bracket.
                  </p>
                  <Button onClick={generateBracket} disabled={participants.length < 2}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Generate Bracket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Bracket Visualization */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Tournament Bracket
                      <Badge variant="outline">{bracketType.replace('-', ' ')}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-8">
                      {mockBracket.map((round, roundIndex) => (
                        <div key={roundIndex} className="flex flex-col items-center space-y-4">
                          <h3 className="text-lg font-semibold text-center">
                            Round {round.round}
                          </h3>
                          <div className="flex flex-wrap justify-center gap-6">
                            {round.matches.map((match, matchIndex) => (
                              <BracketMatch
                                key={match.id}
                                match={match}
                                round={round.round}
                                matchIndex={matchIndex}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tournament Progress */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle>Tournament Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Matches Completed</span>
                          <span>6/7 (86%)</span>
                        </div>
                        <Progress value={86} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Players Remaining</span>
                          <span>2/8</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Bracket Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bracket Type</label>
                  <Select value={bracketType} onValueChange={setBracketType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bracketTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Best of Sets</label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Set</SelectItem>
                        <SelectItem value="3">3 Sets</SelectItem>
                        <SelectItem value="5">5 Sets</SelectItem>
                        <SelectItem value="7">7 Sets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Points per Set</label>
                    <Select defaultValue="11">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11">11 Points</SelectItem>
                        <SelectItem value="21">21 Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline">
                    Reset Bracket
                  </Button>
                  <Button onClick={generateBracket}>
                    Apply Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DndProvider>
  );
}
