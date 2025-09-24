import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  CreditCard,
  Target,
  Trophy,
  Accessibility,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { NavLink } from "react-router-dom";

const trainingGroups: Array<{
  id: 'group1' | 'group2' | 'para';
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  schedule: string[];
  pricing: {
    annual: number;
    monthly: number;
  };
  features: string[];
}> = [
  {
    id: "group1",
    title: "GROUP 1",
    subtitle: "Athletes with TTCAN rating under 300 (focus on fundamentals)",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50",
    schedule: [
      "Mon / Wed / Fri – 6:00 - 7:30 PM"
    ],
    pricing: {
      annual: 625,
      monthly: 70
    },
    features: [
      "Focus on fundamentals",
      "Beginner-friendly environment",
      "Professional coaching",
      "Skill development focus"
    ]
  },
  {
    id: "group2", 
    title: "GROUP 2",
    subtitle: "Athletes with TTCAN rating 300+ (focus on advanced techniques)",
    icon: Trophy,
    color: "text-green-700",
    bgColor: "bg-green-50",
    schedule: [
      "Mon / Wed / Fri – 6:00 - 8:30 PM",
      "Saturday - 9:00 AM - 12:00 PM"
    ],
    pricing: {
      annual: 750,
      monthly: 80
    },
    features: [
      "Advanced techniques",
      "Competitive training",
      "Extended practice time",
      "Saturday sessions included"
    ]
  },
  {
    id: "para",
    title: "PARA PROGRAM", 
    subtitle: "Adaptive table tennis program for athletes with disabilities",
    icon: Accessibility,
    color: "text-green-600",
    bgColor: "bg-green-50",
    schedule: [
      "Saturday - 9:00 - 10:00 AM"
    ],
    pricing: {
      annual: 625,
      monthly: 70
    },
    features: [
      "Adaptive equipment available",
      "Specialized coaching",
      "Inclusive environment",
      "Accessible facilities"
    ]
  }
];

const Training = () => {
  const handleMembershipClick = () => {
    window.location.href = "/membership";
  };

  const handlePaymentClick = (groupId: 'group1' | 'group2' | 'para', type: 'yearly' | 'monthly') => {
    const stripeLinks = {
      group1: {
        yearly: "https://buy.stripe.com/3cI00k0ESfiM3i22Taf3a02",
        monthly: "https://buy.stripe.com/9B614ocnA4E87yialCf3a00"
      },
      group2: {
        yearly: "https://buy.stripe.com/eVq8wQgDQ4E88Cm9hyf3a03",
        monthly: "https://buy.stripe.com/3cI5kE4V8b2w7yigK0f3a01"
      },
      para: {
        yearly: "https://buy.stripe.com/00wbJ2gDQ3A405QctKf3a05",
        monthly: "https://buy.stripe.com/3cI8wQgDQgmQ9GqfFWf3a06"
      }
    };
    
    const link = stripeLinks[groupId][type];
    if (link) {
      window.open(link, '_blank');
    }
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
              Table Tennis Development Program
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Professional training programs designed for all skill levels. 
              Join our development program and take your game to the next level.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Training Journey?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our professional training programs and take your table tennis skills to the next level. 
              Sign up today and become part of our community.
            </p>
            <NavLink
              to="/training-signup"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Let's Start Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Location & Season Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="p-6 md:p-8 border-2 border-green-200 shadow-lg">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-sm text-gray-600">Zion Lutheran Church</p>
                    <p className="text-sm text-gray-600">322 - 4th Ave South</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Season</h3>
                    <p className="text-gray-600">September - June</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Training Groups */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {trainingGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 rounded-full ${group.bgColor} flex items-center justify-center mb-4`}>
                      <group.icon className={`h-8 w-8 ${group.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{group.title}</CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">{group.subtitle}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Schedule */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <Clock className="h-4 w-4 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Schedule</h4>
                      </div>
                      {group.schedule.map((time, idx) => (
                        <p key={idx} className="text-sm text-gray-600 mb-1 ml-6">{time}</p>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Star className="h-4 w-4 text-green-600 mr-2" />
                        Program Features
                      </h4>
                      <ul className="space-y-2">
                        {group.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Pricing Options</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Annual:</span>
                          <span className="font-bold text-green-600">${group.pricing.annual}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Monthly:</span>
                          <span className="font-bold text-green-600">${group.pricing.monthly}</span>
                        </div>
                      </div>
                    </div>

                    {/* Membership Requirement */}
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800 font-medium mb-2">
                        TTSASK MEMBERSHIP REQUIRED
                      </p>
                      <Button
                        onClick={handleMembershipClick}
                        variant="outline"
                        size="sm"
                        className="w-full text-green-700 border-green-300 hover:bg-green-100"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Membership Details
                      </Button>
                    </div>

                    {/* Registration Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => handlePaymentClick(group.id, 'yearly')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Join Us Yearly - ${group.pricing.annual}
                      </Button>
                      <Button
                        onClick={() => handlePaymentClick(group.id, 'monthly')}
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Join Us Monthly - ${group.pricing.monthly}
                      </Button>
                    </div>
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              Ready to Start Training?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our Table Tennis Development Program and train with experienced coaches 
              in a supportive environment. All skill levels welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleMembershipClick}
                size="lg"
                variant="outline"
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <Users className="h-5 w-5 mr-2" />
                Get Membership First
              </Button>
              <Button
                onClick={() => window.location.href = '/contact'}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
      </div>
      </section>

      <Footer />
    </div>
  );
};

export default Training;
