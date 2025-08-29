import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Trophy, BookOpen } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/ui/navigation";

const events = [
  {
    title: "SPED Training Program",
    id: "sped",
    date: "Every Saturday",
    time: "9:00 AM - 12:00 PM",
    location: "Saskatoon Table Tennis Club",
    participants: "12-20 players",
    type: "Training",
    description: "Specialized training program for competitive players looking to improve their skills.",
    features: ["Advanced techniques", "Match play", "Video analysis", "Personal coaching"]
  },
  {
    title: "Youth Development League",
    id: "youth",
    date: "Every Tuesday & Thursday",
    time: "4:00 PM - 6:00 PM",
    location: "Regina Community Center",
    participants: "8-15 players",
    type: "Youth",
    description: "Fun and engaging table tennis program designed specifically for young players aged 8-16.",
    features: ["Basic skills", "Team building", "Fun games", "Tournament prep"]
  },
  {
    title: "Adult Competitive League",
    id: "adult",
    date: "Every Monday & Wednesday",
    time: "7:00 PM - 9:00 PM",
    location: "Prince Albert Sports Complex",
    participants: "16-24 players",
    type: "Competitive",
    description: "High-level competitive play for experienced adult players with regular tournaments.",
    features: ["League matches", "Rankings", "Tournaments", "Advanced strategies"]
  },
  {
    title: "Annual Provincial Championship",
    id: "tournaments",
    date: "March 15-17, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Saskatoon Convention Center",
    participants: "100+ players",
    type: "Tournament",
    description: "The biggest table tennis event in Saskatchewan featuring players from all skill levels.",
    features: ["Multiple divisions", "Prize money", "Provincial rankings", "Social events"]
  }
];

const eventTypes = [
  { type: "Training", icon: BookOpen, color: "bg-blue-500" },
  { type: "Youth", icon: Users, color: "bg-green-500" },
  { type: "Competitive", icon: Trophy, color: "bg-purple-500" },
  { type: "Tournament", icon: Calendar, color: "bg-orange-500" }
];

export default function Events() {
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20"
            >
              Events & Training
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Join Our Events
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover exciting table tennis events, training programs, and tournaments 
              happening across Saskatchewan. There's something for every skill level!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Types Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Types of Events</h2>
            <p className="text-xl text-muted-foreground">
              We offer a variety of programs to suit different interests and skill levels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {eventTypes.map((eventType, index) => (
              <motion.div
                key={eventType.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full ${eventType.color} flex items-center justify-center mx-auto mb-4`}>
                    <eventType.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{eventType.type}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground">
              Browse our calendar of events and find the perfect program for you
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-8 h-full hover:shadow-medium transition-all duration-300 border-2 border-border hover:border-primary/30">
                  <div className="flex items-start justify-between mb-4">
                    <Badge 
                      variant="secondary" 
                      className="px-3 py-1 bg-primary/10 text-primary border-primary/20"
                    >
                      {event.type}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                      <div className="text-sm text-muted-foreground">{event.time}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground mb-6">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{event.participants}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {event.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    Learn More
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join one of our events or training programs and take your table tennis skills to the next level!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary">
                  View All Events
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
