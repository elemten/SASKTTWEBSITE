import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Star } from "lucide-react";

export function CommunitySpotlightSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-sora">
            Community <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Spotlight</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
            Celebrating the achievements and stories that make our table tennis community special.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass overflow-hidden hover:shadow-strong transition-all duration-500">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/2 aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary-light/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Trophy className="h-3 w-3 mr-1" />
                    Championship Winner
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Regina Youth Club
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold font-sora">
                    Regina U15 Team Wins Provincial Championship
                  </h3>
                  <div className="flex">
                    {[1, 2, 3].map((star) => (
                      <Star key={star} className="h-5 w-5 text-primary fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                  Our Regina Youth Club U15 team made history last weekend by winning the Provincial Championship for the first time in the club's history. Led by captain Emma Wilson and coached by former national player David Kim, the team dominated the tournament with a perfect 7-0 record.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tournament Date:</span>
                    <span className="font-medium">March 8-10, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">Saskatoon Sports Complex</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Team Record:</span>
                    <span className="font-medium text-primary">7-0 (Undefeated)</span>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-6">
                  "The dedication and teamwork these young players showed was incredible. They've set a new standard for our program."
                  <br />
                  <span className="text-sm font-medium text-foreground">- Coach David Kim</span>
                </blockquote>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Read Full Story
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View Team Photos →
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
        >
          <Card className="glass p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">12</div>
            <div className="text-sm text-muted-foreground">Championships This Year</div>
          </Card>
          <Card className="glass p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Player Satisfaction</div>
          </Card>
          <Card className="glass p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">8</div>
            <div className="text-sm text-muted-foreground">National Qualifiers</div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}