import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock events data (excluding rentals)
const mockEvents = [
  {
    id: "E001",
    title: "Provincial Championship",
    type: "Tournament",
    date: "2024-12-15",
    time: "09:00",
    location: "Regina Sports Complex",
    capacity: 64,
    registered: 42,
    status: "Open"
  },
  {
    id: "E002",
    title: "Youth Training Camp",
    type: "Training",
    date: "2024-12-08",
    time: "14:00",
    location: "Saskatoon TT Club",
    capacity: 20,
    registered: 18,
    status: "Almost Full"
  },
  {
    id: "E003",
    title: "Beginner Workshop",
    type: "Workshop",
    date: "2024-12-20",
    time: "10:00",
    location: "Moose Jaw Community Center",
    capacity: 15,
    registered: 12,
    status: "Open"
  },
  {
    id: "E004",
    title: "Regional Qualifier",
    type: "Tournament",
    date: "2024-12-22",
    time: "13:00",
    location: "North Battleford Arena",
    capacity: 32,
    registered: 28,
    status: "Almost Full"
  },
];

const eventTypes = ["Tournament", "Training", "Workshop", "Exhibition"];

export function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockEvents.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800 border-green-200";
      case "Almost Full": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Full": return "bg-red-100 text-red-800 border-red-200";
      case "Cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tournament": return "bg-blue-100 text-blue-800";
      case "Training": return "bg-purple-100 text-purple-800";
      case "Workshop": return "bg-orange-100 text-orange-800";
      case "Exhibition": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage tournaments, training camps, and workshops
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-medium">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Event Title</label>
                <Input placeholder="Enter event title" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Event Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <Input type="time" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input placeholder="Enter location" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Capacity</label>
                <Input type="number" placeholder="Max participants" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">Create Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {mockEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="glass h-full hover:shadow-strong transition-all duration-300 group-hover:shadow-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                      {event.type}
                    </Badge>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  {event.time}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  {event.registered}/{event.capacity} registered
                </div>

                <div className="pt-3 border-t border-border/50">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Event details and management options
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Type:</span>
                  <div className="mt-1">
                    <Badge className={getTypeColor(selectedEvent.type)}>
                      {selectedEvent.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedEvent.status)}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-primary" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-3 text-primary" />
                  {selectedEvent.time}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-primary" />
                  {selectedEvent.registered}/{selectedEvent.capacity} registered
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" className="flex-1">
                  Edit Event
                </Button>
                <Button variant="outline" className="flex-1">
                  Manage Registrations
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
