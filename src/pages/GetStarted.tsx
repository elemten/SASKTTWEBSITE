import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Building, 
  Shield, 
  Target, 
  ArrowRight,
  Trophy,
  Users,
  Award
} from "lucide-react";

const getStartedOptions = [
  {
    id: "player",
    title: "Start as Player",
    description: "Join as an individual player and access training programs, tournaments, and club benefits",
    icon: UserPlus,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100",
    route: "/membership",
    features: [
      "Access to sanctioned tournaments",
      "Training program eligibility", 
      "Club membership benefits",
      "Provincial ranking system"
    ]
  },
  {
    id: "club",
    title: "Start as Club",
    description: "Register your club and get access to grants, resources, and official recognition",
    icon: Building,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200", 
    hoverColor: "hover:bg-green-100",
    route: "/clubs/register",
    features: [
      "MAP grant eligibility",
      "Official club recognition",
      "Member management tools",
      "Event hosting support"
    ]
  },
  {
    id: "official",
    title: "Start as Official",
    description: "Become a certified table tennis official and help grow the sport in Saskatchewan",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100", 
    route: "/officials",
    features: [
      "Official certification programs",
      "Tournament officiating opportunities",
      "Continuing education resources",
      "Provincial official network"
    ]
  },
  {
    id: "coach",
    title: "Start as Coach", 
    description: "Get certified as a table tennis coach and share your passion for the sport",
    icon: Target,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100",
    route: "/coaching",
    features: [
      "Coaching certification courses",
      "Professional development",
      "Access to coaching resources",
      "Mentorship opportunities"
    ]
  }
];

const GetStarted = () => {
  const handleOptionClick = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Get Started Today
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Choose your path and join the Table Tennis Saskatchewan community. 
              Whether you're a player, club, official, or coach - we have the right program for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Options Grid */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Choose Your Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select the option that best describes your role and get started with the right resources and programs
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {getStartedOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${option.borderColor} border-2 ${option.hoverColor} group`}
                  onClick={() => handleOptionClick(option.route)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full ${option.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className={`h-8 w-8 ${option.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{option.title}</CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-grow">
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Trophy className="h-4 w-4 text-green-600 mr-2" />
                        What You Get
                      </h4>
                      <ul className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-md transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(option.route);
                      }}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Join Our Community
              </h2>
            </div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Table Tennis Saskatchewan is dedicated to promoting and developing table tennis 
              across the province. No matter which path you choose, you'll be part of a 
              supportive community passionate about growing the sport.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Standards</h3>
                <p className="text-sm text-gray-600">High-quality programs and certifications</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
                <p className="text-sm text-gray-600">Connect with fellow enthusiasts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                <p className="text-sm text-gray-600">Develop your skills and career</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetStarted;
