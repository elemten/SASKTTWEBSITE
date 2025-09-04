import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Trophy, 
  Clock, 
  MapPin, 
  Shield, 
  Activity,
  Brain,
  HandHeart,
  GraduationCap,
  Calendar,
  CheckCircle,
  ArrowDown
} from "lucide-react";
import SPEDBookingForm from "@/components/booking/SPEDBookingForm";
import { useState, useEffect } from "react";

const SPED = () => {
  const [showFloatingBubble, setShowFloatingBubble] = useState(true); // Show immediately for testing

  // Always show floating button - no scroll detection needed
  useEffect(() => {
    setShowFloatingBubble(true);
  }, []);

  // Scroll to booking form
  const scrollToBookingForm = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: Activity,
      title: "Physical Development",
      description: "Improves hand-eye coordination, balance, and motor skills through structured table tennis activities designed for all abilities."
    },
    {
      icon: Users,
      title: "Social Skills",
      description: "Encourages teamwork, communication, and positive social interaction in a supportive, inclusive environment."
    },
    {
      icon: Trophy,
      title: "Confidence Building",
      description: "Builds self-esteem and confidence through achievable goals, positive reinforcement, and celebrating every success."
    }
  ];

  const programFeatures = [
    {
      icon: Shield,
      title: "Certified Instructors",
      description: "Experienced coaches with special education training and adaptive sports expertise"
    },
    {
      icon: Brain,
      title: "Adaptive Methods",
      description: "Customized teaching approaches and equipment modifications for individual needs"
    },
    {
      icon: HandHeart,
      title: "Inclusive Environment",
      description: "Safe, welcoming space where every student can thrive and develop at their own pace"
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Progressive learning that builds fundamental table tennis skills while having fun"
    }
  ];

  const sessionDetails = [
    {
      icon: Clock,
      title: "Session Duration",
      description: "1-2 hours per session",
      detail: "Flexible timing based on group needs"
    },
    {
      icon: Users,
      title: "Group Size",
      description: "Small groups (4-8 students)",
      detail: "Maximum personalized attention"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Zion Lutheran Church",
      detail: "323 4th Avenue South, Saskatoon, SK"
    },
    {
      icon: Calendar,
      title: "Schedule",
      description: "Weekday sessions available",
      detail: "Monday-Friday, various time slots"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Same style as Membership page */}
      <section className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge 
              variant="secondary" 
              className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-green-100 text-green-800 border-green-200 text-xs md:text-sm"
            >
              <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Special Education Program
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              SPED Table Tennis Program
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Inclusive table tennis training designed specifically for students with special needs. 
              Building confidence, coordination, and community through adaptive sports.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Program Benefits
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our SPED program focuses on holistic development through table tennis
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full border-2 border-green-100 hover:border-green-200 transition-colors duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle className="text-green-700 text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our SPED Program?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Specialized approach designed for students with diverse learning needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {programFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-gray-900 text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session Details */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Session Information
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our SPED table tennis sessions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {sessionDetails.map((detail, index) => (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full border-2 border-green-100 hover:border-green-200 transition-colors duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <detail.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-green-700 text-lg">{detail.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-900 font-semibold mb-2">{detail.description}</p>
                      <p className="text-gray-600 text-sm">{detail.detail}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Book Your SPED Session
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Complete the form below to book your Special Physical Education table tennis sessions. 
                Our team will contact you to confirm your booking.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SPEDBookingForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                Join our inclusive table tennis community and help your students develop 
                new skills while having fun in a supportive environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-green-100">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Certified instructors</span>
                </div>
                <div className="flex items-center text-green-100">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Adaptive equipment</span>
                </div>
                <div className="flex items-center text-green-100">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Inclusive environment</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Bubble - Always Sticky */}
      <div
        className="fixed bottom-4 right-4 z-[9999]"
        style={{ 
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999
        }}
      >
        <button
          onClick={scrollToBookingForm}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Scroll to booking form"
          style={{
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.8)',
            minWidth: '70px',
            minHeight: '70px',
            fontSize: '12px',
            backgroundColor: '#16a34a',
            border: '3px solid white',
            opacity: 1,
            visibility: 'visible'
          }}
        >
          <ArrowDown className="h-6 w-6 mx-auto" />
          <div className="text-xs mt-1 font-bold text-center">BOOK</div>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default SPED;