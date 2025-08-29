import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Heart, Target, Award, Globe } from "lucide-react";
import { Sitemap } from "@/components/sitemap";
import { Navigation } from "@/components/ui/navigation";

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe in building strong, inclusive communities through the sport of table tennis."
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from training programs to tournament organization."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for table tennis drives us to share this amazing sport with others."
  },
  {
    icon: Target,
    title: "Growth",
    description: "We're committed to helping players of all levels grow and improve their skills."
  }
];

const achievements = [
  {
    year: "2023",
    title: "Provincial Championship Success",
    description: "Hosted the largest table tennis tournament in Saskatchewan history with over 150 participants."
  },
  {
    year: "2022",
    title: "Youth Development Award",
    description: "Received recognition for our outstanding youth development programs and community engagement."
  },
  {
    year: "2021",
    title: "Community Impact",
    description: "Expanded our reach to 25+ communities across Saskatchewan with new club partnerships."
  },
  {
    year: "2020",
    title: "Digital Innovation",
    description: "Launched online training programs and virtual tournaments during challenging times."
  }
];

const team = [
  {
    name: "Sarah Chen",
    role: "Executive Director",
    description: "Former national champion with 15+ years of coaching experience.",
    image: "sarah"
  },
  {
    name: "Michael Rodriguez",
    role: "Program Coordinator",
    description: "Specializes in youth development and community outreach programs.",
    image: "michael"
  },
  {
    name: "Dr. Emily Thompson",
    role: "Technical Director",
    description: "ITTF certified coach and sports science expert.",
    image: "emily"
  },
  {
    name: "David Kim",
    role: "Events Manager",
    description: "Tournament organizer and equipment specialist.",
    image: "david"
  }
];

export default function About() {
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
              About Us
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Our Story
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Table Tennis Saskatchewan is more than just a sports organization. 
              We're a community dedicated to promoting excellence, fostering connections, 
              and sharing the joy of table tennis across our province.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To promote and develop table tennis excellence across Saskatchewan by providing 
                  quality programs, competitive opportunities, and fostering a vibrant, inclusive 
                  community that celebrates the sport at all levels.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be the leading table tennis organization in Canada, recognized for our 
                  innovative programs, community impact, and the development of world-class 
                  players while maintaining our commitment to accessibility and inclusion.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Key Achievements</h2>
            <p className="text-xl text-muted-foreground">
              Milestones that mark our journey of growth and impact
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 hover:shadow-medium transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <Badge className="px-3 py-1 bg-primary text-primary-foreground text-lg">
                      {achievement.year}
                    </Badge>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Meet the dedicated professionals behind our success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge 
                    variant="secondary" 
                    className="mb-3 px-3 py-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
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
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of our growing table tennis family and help us continue building 
                excellence across Saskatchewan!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary">
                  Become a Member
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Sitemap Section */}
      <Sitemap />
    </div>
  );
}
