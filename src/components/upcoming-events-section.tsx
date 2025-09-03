import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const events = [
  {
    title: "Group 1 Training",
    date: "2024-03-15",
    time: "6:00 PM - 7:30 PM", 
    location: "Zion Lutheran Church, 322 - 4th Ave South",
    category: "Training",
    participants: "Open spots available",
    description: "Training for athletes with TTCAN rating under 300, focusing on fundamentals. Mon/Wed/Fri sessions.",
    status: "Registration Required",
  },

  {
    title: "Group 2 Training",
    date: "2024-03-16",
    time: "6:00 PM - 8:30 PM",
    location: "Zion Lutheran Church, 322 - 4th Ave South",
    category: "Training",
    participants: "Open spots available",
    description: "Training for athletes with TTCAN rating 300+, focusing on advanced techniques. Mon/Wed/Fri + Saturday sessions.",
    status: "Registration Required",
  },

  {
    title: "Para Program",
    date: "2024-03-17",
    time: "9:00 AM - 10:00 AM",
    location: "Zion Lutheran Church, 322 - 4th Ave South",
    category: "Training",
    participants: "Open spots available",
    description: "Saturday morning Para Program training sessions designed for athletes with disabilities.",
    status: "Registration Required",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const eventVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
  },
};

export function UpcomingEventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tournament': return 'bg-primary/10 text-primary border-primary/20';
      case 'Training': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-sora">
            Upcoming <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Join us for tournaments and training sessions. There's always something exciting happening in our community.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              variants={eventVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              <Card className="glass h-full p-6 hover:shadow-strong transition-all duration-300 group hover:shadow-primary/20 animate-gpu hover-optimized">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {event.status}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-3 font-sora group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <p className="text-muted-foreground mb-4 font-light leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {event.participants}
                  </div>
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                >
                  Register / RSVP
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button variant="hero">
            View Full Calendar →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}