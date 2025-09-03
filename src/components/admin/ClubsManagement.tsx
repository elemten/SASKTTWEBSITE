import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MapPin, Users, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data
const mockClubs = [
  {
    id: "C001",
    name: "Regina Table Tennis Club",
    district: "Regina",
    owner: "Robert Wilson",
            contact: "306-880-3660",
    email: "info@reginatt.ca",
    address: "1234 Victoria Ave, Regina, SK",
    memberCount: 85,
    registrationStatus: "Paid",
    registrationFee: 500,
    established: "2018"
  },
  {
    id: "C002", 
    name: "Saskatoon Sports Club",
    district: "Saskatoon",
    owner: "Linda Chen",
            contact: "306-880-3660",
    email: "contact@saskatoonsports.ca",
    address: "567 Circle Dr, Saskatoon, SK",
    memberCount: 92,
    registrationStatus: "Pending",
    registrationFee: 500,
    established: "2019"
  },
  {
    id: "C003",
    name: "Prince Albert Table Tennis",
    district: "Prince Albert",
    owner: "Michael Zhang",
            contact: "306-880-3660", 
    email: "pa.tabletennis@email.ca",
    address: "890 Central Ave, Prince Albert, SK",
    memberCount: 34,
    registrationStatus: "Overdue",
    registrationFee: 500,
    established: "2020"
  }
];

export const ClubsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === "all" || club.district === districtFilter;
    const matchesStatus = statusFilter === "all" || club.registrationStatus.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
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
          <h1 className="text-3xl font-bold text-foreground">Clubs Management</h1>
          <p className="text-muted-foreground">Manage registered clubs and their details</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Register New Club
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Register New Club</DialogTitle>
              <DialogDescription>
                Register a new table tennis club with Table Tennis Saskatchewan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Club Name" />
              <Input placeholder="Owner/Contact Person" />
              <Input placeholder="Phone Number" />
              <Input placeholder="Email Address" />
              <Input placeholder="Full Address" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regina">Regina</SelectItem>
                  <SelectItem value="saskatoon">Saskatoon</SelectItem>
                  <SelectItem value="prince-albert">Prince Albert</SelectItem>
                  <SelectItem value="moose-jaw">Moose Jaw</SelectItem>
                  <SelectItem value="swift-current">Swift Current</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Register Club</Button>
                <Button variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clubs by name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="Regina">Regina</SelectItem>
                  <SelectItem value="Saskatoon">Saskatoon</SelectItem>
                  <SelectItem value="Prince Albert">Prince Albert</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club, index) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass hover:shadow-medium transition-all duration-300 hover:scale-[1.02] border-border/50 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">{club.name}</CardTitle>
                  <Badge className={getStatusColor(club.registrationStatus)}>
                    {club.registrationStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">ID: {club.id}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{club.district}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{club.memberCount} members</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Owner:</span>
                    <p className="text-muted-foreground">{club.owner}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{club.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{club.email}</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Registration Fee:</span>
                    <span className="font-medium text-foreground">${club.registrationFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Established:</span>
                    <span className="text-muted-foreground">{club.established}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};