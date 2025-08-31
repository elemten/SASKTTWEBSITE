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

// Mock data
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
    id: "R001",
    title: "Court Rental - Team Practice",
    type: "Rental",
    date: "2024-12-03",
    time: "19:00",
    location: "Prince Albert TT",
    duration: "2 hours",
    status: "Confirmed"
  }
];

export const EventsRentals = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-success text-success-foreground";
      case "almost full":
        return "bg-warning text-warning-foreground";
      case "full":
        return "bg-destructive text-destructive-foreground";
      case "confirmed":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "tournament":
        return "bg-primary text-primary-foreground";
      case "training":
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
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground">Manage tournaments and training sessions</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex border border-border/50 rounded-lg p-1">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Event/Rental
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new tournament or training session.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="training">Training</SelectItem>

                    </SelectContent>
                  </Select>
                  <Input placeholder="Event Title" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <Input type="date" placeholder="Date" />
                  <Input type="time" placeholder="Time" />
                  <Input placeholder="Duration" />
                </div>
                
                <Input placeholder="Location" />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Capacity" type="number" />
                  <Input placeholder="Registration Fee" />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Event</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "calendar" ? (
        /* Calendar View */
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>December 2024</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Adjust for month start
                const isToday = day === 3;
                const hasEvent = [3, 8, 15].includes(day);
                
                return (
                  <div
                    key={i}
                    className={`
                      aspect-square p-2 border border-border/50 rounded-lg
                      ${day < 1 || day > 31 ? "text-muted-foreground bg-muted/20" : ""}
                      ${isToday ? "bg-primary text-primary-foreground" : ""}
                      ${hasEvent && !isToday ? "bg-accent/50" : ""}
                    `}
                  >
                    {day > 0 && day <= 31 && (
                      <div>
                        <div className="text-sm font-medium">{day}</div>
                        {hasEvent && (
                          <div className="mt-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover:shadow-medium transition-all duration-300 hover:scale-[1.02] border-border/50 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{event.title}</CardTitle>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {event.id}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {event.registered}/{event.capacity} registered
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
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
      )}
    </motion.div>
  );
};