import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8"
          >
            <Clock className="h-12 w-12 text-primary" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Coming Soon
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Login and signup features are currently under development
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            We're working hard to bring you a secure and seamless authentication system. 
            Soon you'll be able to create accounts, manage your membership, and access 
            exclusive features.
          </motion.div>

          {/* Features Coming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">User Accounts</h3>
              <p className="text-sm text-gray-600">Create and manage your profile</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
              <p className="text-sm text-gray-600">Protected member-only content</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your training journey</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back Home
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              <Link to="/membership">
                View Membership Options
              </Link>
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> You can still join our training programs and become a member 
              using the Stripe payment links. The authentication system will be added later to 
              provide additional features and account management.
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
