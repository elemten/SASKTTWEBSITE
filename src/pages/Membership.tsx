import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, UserPlus, CreditCard, Users, Trophy, Calendar, Target } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/ui/navigation";

const membershipBenefits = [
  "Participate in all sanctioned activities",
  "Access to affiliated club benefits",
  "Tournament entry eligibility", 
  "Monthly newsletter and updates",
  "Support growing table tennis in Saskatchewan",
  "Member-only events and programs",
  "Discounted coaching and training programs",
  "Priority registration for special events"
];

const membershipFeatures = [
  {
    icon: Users,
    title: "Sanctioned Activities",
    description: "Participate in all official Table Tennis Saskatchewan tournaments and events"
  },
  {
    icon: Trophy,
    title: "Affiliated Clubs",
    description: "Play at our network of affiliated clubs across Saskatchewan (clubs may have additional fees)"
  },
  {
    icon: Target,
    title: "Grow the Sport",
    description: "Help us develop and promote table tennis throughout the province"
  }
];

export default function Membership() {
  const handleMembershipClick = () => {
    window.open("https://buy.stripe.com/5kQ9AU2N0eeIcSCfFWf3a04", "_blank");
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
            <Badge 
              variant="secondary" 
              className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-green-100 text-green-800 border-green-200 text-xs md:text-sm"
            >
              <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Join Our Community
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Table Tennis Saskatchewan Membership
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-green-100 leading-relaxed px-2">
              Become a member and help grow our sport. Join Saskatchewan's premier 
              table tennis community for just $10 per year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Membership Card */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-4 sm:p-6 md:p-8 lg:p-12 border-2 border-green-200 shadow-xl relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-6 py-2 text-sm font-semibold">
                  <Star className="h-4 w-4 mr-2" />
                  Annual Membership
                </Badge>
              </div>

              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">
                  Table Tennis Saskatchewan Member
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                  For $10.00 you can become a Table Tennis Saskatchewan member. 
                  With this membership you will be able to participate in any of our sanctioned activities.
                </p>
                
                <div className="mb-6 md:mb-8">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-600">
                    $10
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-500 ml-2">/year</span>
                </div>
              </div>

              {/* Benefits List */}
              <div className="mb-8 md:mb-10">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center text-gray-900">
                  What You Get:
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
                  {membershipBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="flex items-start space-x-3"
                    >
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Special Note */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-green-800 mb-2">For Returning Members:</h4>
                <p className="text-green-700 text-sm">
                  If you are a past member and your personal details haven't changed, 
                  you only need to pay the $10 annual fee to update your membership.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleMembershipClick}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  APPLICATION / PAY $10 FEE
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">
              Membership Benefits
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Your membership supports the growth of table tennis across Saskatchewan 
              and gives you access to our community of players and events.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {membershipFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="p-4 sm:p-6 md:p-8 h-full hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 md:mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 md:py-20 bg-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">
              Join Our Growing Community
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-2">
              Become a member and help grow our sport. Your $10 membership fee helps us 
              organize tournaments, support clubs, and develop table tennis programs 
              throughout Saskatchewan.
            </p>
            <Button
              onClick={handleMembershipClick}
              size="xl"
              className="bg-green-600 hover:bg-green-700 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mr-2 md:mr-3" />
              Become a Member Today
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}