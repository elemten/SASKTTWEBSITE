import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "How do I become a member of Table Tennis Saskatchewan?",
    answer: "You can become a member by visiting our Membership page and filling out the registration form. We offer various membership levels including individual, family, and club memberships."
  },
  {
    question: "How do I start a table tennis club in my area?",
    answer: "Starting a club is easy! Visit our Club Registration page for detailed instructions. We provide support with equipment, training, and administrative guidance to help you get started."
  },
  {
    question: "What training programs do you offer?",
    answer: "We offer a variety of training programs including beginner clinics, advanced training, para table tennis, and youth programs. Check our Training section for current offerings."
  },
  {
    question: "How can I become a certified coach or official?",
    answer: "We offer certification programs for both coaches and officials. Visit our Coaching and Officials pages for information on training requirements and upcoming certification courses."
  },
  {
    question: "Where can I play table tennis in Saskatchewan?",
    answer: "We have clubs and facilities across the province. Check our 'Where to Play' section for locations, or contact us for information about clubs in your area."
  },
  {
    question: "What equipment do I need to get started?",
    answer: "To get started, you'll need a paddle (racket), table tennis balls, and access to a table. Many clubs provide equipment for beginners. Check our Resources section for equipment recommendations."
  },
  {
    question: "How do I register for tournaments and events?",
    answer: "Tournament registration is available through our Events page. Most tournaments require advance registration, so check our calendar regularly for upcoming events."
  },
  {
    question: "What are the benefits of joining Table Tennis Saskatchewan?",
    answer: "Members enjoy access to training programs, tournament participation, coaching resources, club networking, insurance coverage, and representation in provincial and national competitions."
  },
  {
    question: "How can I volunteer or get involved with the organization?",
    answer: "We welcome volunteers! You can help with events, coaching, officiating, or administrative tasks. Contact us to learn about current volunteer opportunities."
  },
  {
    question: "What age groups do you serve?",
    answer: "We serve all age groups from youth (5+) to seniors. Our programs are designed to accommodate different skill levels and age groups, including specialized programs for youth and para athletes."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary to-primary-dark text-white py-20"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Find answers to common questions about table tennis, membership, and our organization
          </p>
        </div>
      </motion.div>

      {/* FAQ Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
