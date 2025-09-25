import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, MapPin, Users, Search, Filter, Eye, Edit, Trash2, Activity, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock SPED programs data
const mockSPEDPrograms = [
  {
    id: "S001",
    title: "SPED Level 1 Certification",
    level: "Level 1",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Regina Sports Complex",
    instructor: "Certified SPED Instructor",
    capacity: 20,
    registered: 15,
    status: "Open",
    fee: 200,
    duration: "2 days",
    description: "Introduction to Sport for Persons with a Disability coaching principles."
  },
  {
    id: "S002", 
    title: "SPED Level 2 Advanced Training",
    level: "Level 2",
    date: "2024-12-22",
    startTime: "09:00",
    endTime: "17:00",
    location: "Saskatoon TT Club",
    instructor: "Master SPED Trainer",
    capacity: 15,
    registered: 12,
    status: "Open",
    fee: 300,
    duration: "3 days",
    description: "Advanced techniques for coaching athletes with disabilities."
  },
  {
    id: "S003",
    title: "Adaptive Equipment Workshop",
    level: "Workshop",
    date: "2024-12-28",
    startTime: "13:00",
    endTime: "16:00",
    location: "Moose Jaw Community Center",
    instructor: "Equipment Specialist",
    capacity: 25,
    registered: 18,
    status: "Almost Full",
    fee: 75,
    duration: "Half day",
    description: "Learn about adaptive equipment and modifications for table tennis."
  }
];

// Mock participants data
const mockParticipants = [
  {
    id: "P001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(306) 555-0123",
    program: "SPED Level 1 Certification",
    registrationDate: "2024-11-15",
    status: "Confirmed",
    accommodations: "Wheelchair accessible seating"
  },
  {
    id: "P002",
    name: "Sarah Johnson", 
    email: "sarah.j@email.com",
    phone: "(306) 555-0124",
    program: "SPED Level 2 Advanced Training",
    registrationDate: "2024-11-20",
    status: "Confirmed",
    accommodations: "None"
  },
  {
    id: "P003",
    name: "Mike Chen",
    email: "mike.chen@email.com", 
    phone: "(306) 555-0125",
    program: "Adaptive Equipment Workshop",
    registrationDate: "2024-11-25",
    status: "Waitlist",
    accommodations: "Sign language interpreter"
  }
];

const levelTypes = ["All", "Level 1", "Level 2", "Workshop", "Certification"];
const statusTypes = ["All", "Open", "Almost Full", "Full", "Cancelled"];

export function SPED() {
  const [activeTab, setActiveTab] = useState("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPrograms = mockSPEDPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "All" || program.level === levelFilter;
    const matchesStatus = statusFilter === "All" || program.status === statusFilter;
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const filteredParticipants = mockParticipants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.program.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800 border-green-200";
      case "Almost Full": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Full": return "bg-red-100 text-red-800 border-red-200";
      case "Cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Waitlist": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Level 1": return "bg-blue-100 text-blue-800";
      case "Level 2": return "bg-purple-100 text-purple-800";
      case "Workshop": return "bg-orange-100 text-orange-800";
      case "Certification": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Stats
  const totalPrograms = mockSPEDPrograms.length;
  const openPrograms = mockSPEDPrograms.filter(p => p.status === "Open").length;
  const totalParticipants = mockSPEDPrograms.reduce((sum, p) => sum + p.registered, 0);
  const totalRevenue = mockSPEDPrograms.reduce((sum, p) => sum + (p.registered * p.fee), 0);

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
          <h1 className="text-3xl font-bold text-foreground">SPED Programs</h1>
          <p className="text-muted-foreground">Sport for Persons with a Disability training and certification</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create SPED Program
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold">{totalPrograms}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Programs</p>
                <p className="text-2xl font-bold text-green-600">{openPrograms}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold text-blue-600">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="programs" className="gap-2">
            <Activity className="h-4 w-4" />
            Programs
          </TabsTrigger>
          <TabsTrigger value="participants" className="gap-2">
            <Users className="h-4 w-4" />
            Participants
          </TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levelTypes.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full glass border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getLevelColor(program.level)}>
                        {program.level}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold">{program.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{program.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.startTime} - {program.endTime}</span>
                      <span className="ml-2">({program.duration})</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{program.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Instructor: {program.instructor}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {program.registered}/{program.capacity}
                        </span>
                        <span className="text-muted-foreground">registered</span>
                      </div>
                      <div className="font-semibold text-primary">
                        ${program.fee}
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(program.registered / program.capacity) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Program
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Program
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{participant.name}</h3>
                          <Badge className={getStatusColor(participant.status)}>
                            {participant.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Email:</span> {participant.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {participant.phone}
                          </div>
                          <div>
                            <span className="font-medium">Program:</span> {participant.program}
                          </div>
                          <div>
                            <span className="font-medium">Registered:</span> {participant.registrationDate}
                          </div>
                        </div>

                        {participant.accommodations !== "None" && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="font-medium text-yellow-800">Accommodations needed:</span>
                            <span className="text-yellow-700 ml-2">{participant.accommodations}</span>
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Registration
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Registration
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {((activeTab === "programs" && filteredPrograms.length === 0) || 
        (activeTab === "participants" && filteredParticipants.length === 0)) && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No {activeTab === "programs" ? "Programs" : "Participants"} Found
          </h3>
          <p className="text-muted-foreground">
            {searchQuery || levelFilter !== "All" || statusFilter !== "All" 
              ? "Try adjusting your search or filters"
              : `Create your first SPED ${activeTab === "programs" ? "program" : "participant registration"} to get started`
            }
          </p>
        </div>
      )}
    </motion.div>
  );
}
