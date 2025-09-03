import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Heart, Target, Zap, Star, ChevronRight, Award, Clock, Play } from "lucide-react";
import { isLowEndMobile } from "@/lib/performance-utils";

const HistoryMission = () => {
  const isLowEnd = isLowEndMobile();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLowEnd ? 0.1 : 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isLowEnd ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isLowEnd ? 0.2 : 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const timelineEvents = [
    {
      year: "1970",
      title: "The Beginning",
      icon: Star,
      description: "The Saskatchewan Table Tennis Association was formed to enable Saskatchewan athletes to participate in the 1971 Canada Winter Games.",
      details: "This marked the foundation of organized table tennis in Saskatchewan."
    },
    {
      year: "1975",
      title: "Official Incorporation",
      icon: Award,
      description: "STTA was officially incorporated as a Society on April 18, 1975, with the original office at 114 Sunset Drive in Regina.",
      details: "First President: Robert Vos | First Coach: Taka Kinose"
    },
    {
      year: "1981",
      title: "A New Era",
      icon: Trophy,
      description: "STTA became fully incorporated as Saskatchewan Table Tennis Association Incorporated on November 17th, 1981.",
      details: "Dave Coleman appointed as Executive Director | First funding from Sask Sport: $13,200"
    },
    {
      year: "1987",
      title: "Leadership Transition",
      icon: Users,
      description: "Steve Taylor was hired to run the STTA office, marking a new phase of professional administration.",
      details: "Christian Lillieroos hired as Provincial Coach"
    },
    {
      year: "2021",
      title: "Looking Forward",
      icon: Target,
      description: "Continuing the legacy with new leadership and expanded programs for the future of table tennis in Saskatchewan.",
      details: "Building on decades of dedication and growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 pt-16 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: isLowEnd ? 0.3 : 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 blur-sm"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          <motion.div
            className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-white/3 blur-sm"
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </div>

        <div className="relative container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: isLowEnd ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isLowEnd ? 0.3 : 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white hero-title"
              initial={{ opacity: 0, scale: isLowEnd ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isLowEnd ? 0.3 : 0.8, delay: 0.4 }}
            >
              Our Journey
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-emerald-100 mb-8 leading-relaxed hero-subtitle"
              initial={{ opacity: 0, y: isLowEnd ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isLowEnd ? 0.3 : 0.8, delay: 0.6 }}
            >
              From humble beginnings in 1970 to becoming Saskatchewan's premier table tennis organization
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: isLowEnd ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isLowEnd ? 0.3 : 0.8, delay: 0.8 }}
            >
              <Button
                size="xl"
                variant="glass"
                className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-strong"
                onClick={() => window.location.href = "/membership"}
              >
                <Users className="mr-2 h-5 w-5" />
                Join Our Legacy
              </Button>

              <Badge variant="secondary" className="text-sm px-6 py-3 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                Celebrating 50+ Years of Excellence
              </Badge>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Timeline Section */}
        <motion.section className="mb-24" variants={itemVariants}>
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={itemVariants}
            >
              The Timeline of Excellence
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Follow our journey through the decades as we built Saskatchewan's table tennis legacy
            </motion.p>
          </div>

          {/* Timeline for Desktop */}
          <div className="hidden lg:block relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary via-primary-light to-primary h-full"></div>

            <div className="space-y-16">
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <motion.div
                    key={event.year}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    variants={itemVariants}
                  >
                    <motion.div
                      className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                      variants={itemVariants}
                    >
                      <Card className="glass shadow-strong border-0 hover:shadow-medium transition-all duration-500 bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="p-3 bg-gradient-primary rounded-2xl text-primary-foreground mr-4 shadow-soft">
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <Badge variant="secondary" className="text-sm font-semibold px-4 py-2">
                                {event.year}
                              </Badge>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                          <p className="text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                          <p className="text-sm text-primary font-medium">{event.details}</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      className="w-8 h-8 bg-gradient-primary rounded-full border-4 border-background shadow-strong flex items-center justify-center z-10"
                      variants={itemVariants}
                    >
                      <div className="w-2 h-2 bg-background rounded-full"></div>
                    </motion.div>

                    <div className="w-1/2"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Timeline for Mobile */}
          <div className="lg:hidden space-y-8">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon;
              return (
                <motion.div
                  key={event.year}
                  className="flex gap-6"
                  variants={itemVariants}
                >
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft"
                    variants={itemVariants}
                  >
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </motion.div>

                  <motion.div className="flex-1" variants={itemVariants}>
                    <Card className="glass shadow-soft border-0 bg-card/60 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-sm font-semibold">
                            {event.year}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-3 leading-relaxed text-sm">{event.description}</p>
                        <p className="text-xs text-primary font-medium">{event.details}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Vision & Mission Section */}
        <motion.section className="mb-24" variants={itemVariants}>
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={itemVariants}
            >
              Our Purpose & Goals
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Guiding principles that drive our commitment to excellence in table tennis
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div variants={itemVariants}>
              <Card className="glass shadow-strong border-0 hover:shadow-medium transition-all duration-500 h-full bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-primary rounded-2xl text-primary-foreground mr-4 shadow-soft">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                      <Badge variant="secondary" className="mt-2">Forward Looking</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Table Tennis Saskatchewan's vision is to develop players in the sport of table tennis and to create healthy competition amongst athletes for the opportunity to represent TTSask and Saskatchewan at all major Provincial, National, International and Olympic competitions.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Player Development</Badge>
                    <Badge variant="outline" className="text-xs">Competition Excellence</Badge>
                    <Badge variant="outline" className="text-xs">National Representation</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass shadow-strong border-0 hover:shadow-medium transition-all duration-500 h-full bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-primary rounded-2xl text-primary-foreground mr-4 shadow-soft">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                      <Badge variant="secondary" className="mt-2">Established 1981</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    TTSask's purpose is to promote and increase the knowledge, skill and proficiency of its members in all things relating to table tennis.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Skill Development</Badge>
                    <Badge variant="outline" className="text-xs">Knowledge Sharing</Badge>
                    <Badge variant="outline" className="text-xs">Community Growth</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

                {/* Strategic Objectives Section */}
        <motion.section className="mb-24" variants={itemVariants}>
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={itemVariants}
            >
              Strategic Objectives
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Our commitment to comprehensive development and inclusion in table tennis
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Long-term Athlete Development",
                description: "Canadian Sport 4 Life (CS4L) framework implementation",
                icon: Award,
                color: "from-primary to-primary-light"
              },
              {
                title: "Aboriginal Sport Development",
                description: "Inclusive programs for Indigenous communities",
                icon: Users,
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "Women in Sport",
                description: "Empowering female athletes and leaders",
                icon: Heart,
                color: "from-rose-500 to-pink-500"
              },
              {
                title: "Coach & Officials Development",
                description: "Building capacity through training and certification",
                icon: Trophy,
                color: "from-amber-500 to-orange-500"
              }
            ].map((objective, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="glass shadow-soft border-0 hover:shadow-medium transition-all duration-500 h-full bg-card/60 backdrop-blur-sm group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${objective.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                      <objective.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{objective.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{objective.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Core Values Section */}
        <motion.section className="mb-24" variants={itemVariants}>
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={itemVariants}
            >
              Our Core Values
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              The principles that guide our community and drive our excellence
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Sport Purity",
                description: "Honoring the integrity and spirit of table tennis",
                icon: Target,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Athlete Excellence",
                description: "Supporting Saskatchewan athletes to reach their highest potential",
                icon: Trophy,
                color: "from-blue-500 to-indigo-500"
              },
              {
                title: "Holistic Development",
                description: "Physical, social, and emotional growth through table tennis",
                icon: Heart,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Community Team",
                description: "Valuing our volunteers, coaches, officials, and families",
                icon: Users,
                color: "from-orange-500 to-red-500"
              },
              {
                title: "Club Structure",
                description: "Supporting local clubs as the foundation of our sport",
                icon: Award,
                color: "from-teal-500 to-cyan-500"
              },
              {
                title: "Universal Access",
                description: "Table tennis accessible to everyone regardless of background",
                icon: Zap,
                color: "from-amber-500 to-yellow-500"
              }
            ].map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="glass shadow-soft border-0 hover:shadow-medium transition-all duration-500 h-full bg-card/60 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section className="mb-24" variants={itemVariants}>
          <Card className="glass shadow-strong border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <CardContent className="relative p-12 md:p-16 text-center">
              <motion.div variants={itemVariants}>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Join Our Legacy
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                  Be part of Saskatchewan's table tennis legacy and help us continue this remarkable story of excellence and community
                </p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  variants={itemVariants}
                >
                  <Button
                    asChild
                    size="xl"
                    variant="hero"
                    className="px-8 py-4 text-lg font-semibold shadow-strong hover:shadow-medium transition-all duration-300"
                  >
                    <a href="/membership" className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Become a Member
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="xl"
                    variant="glass"
                    className="px-8 py-4 text-lg font-semibold bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  >
                    <a href="/contact" className="flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Get Started
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>

      <Footer />
    </div>
  );
};

export default HistoryMission;


