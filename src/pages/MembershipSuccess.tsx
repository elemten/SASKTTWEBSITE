import { motion } from "framer-motion";
import { CheckCircle, Home, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function MembershipSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Submitted!
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6">
              Thank you for joining Table Tennis Saskatchewan! Your membership application has been received and is being processed.
            </p>

            {/* What's Next */}
            <div className="bg-green-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>We'll review your application within 1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You'll receive a confirmation email with your membership number</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payment instructions will be included in the confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Once payment is received, your membership will be activated</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Questions?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>info@ttsask.ca</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>(306) 975-0823</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/membership')}
                className="flex-1"
              >
                Learn More About Membership
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
