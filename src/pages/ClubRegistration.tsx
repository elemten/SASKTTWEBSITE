import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Users, Award, Calendar, ArrowRight, Mail, Phone, Clock, Shield, Upload, Building2, Target, DollarSign, Sparkles } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/ui/navigation";

const registrationSteps = [
  {
    step: 1,
    title: "Initial Application",
    description: "Submit your club registration form with basic information",
    details: [
      "Club name and contact information",
      "Location and facility details",
      "Number of active members (15+)"
    ],
  },
  {
    step: 2,
    title: "Documentation Review",
    description: "Our team reviews your application and supporting documents",
    details: [
      "Verification of club structure",
      "Review of safety protocols",
      "Facility inspection scheduling"
    ],
  },
  {
    step: 3,
    title: "Grant Approval Process",
    description: "MAP grant application and approval for eligible clubs",
    details: [
      "Grant application submission",
      "Budget and program review",
      "Grant amount determination",
      "Approval and funding release"
    ],
  },
  {
    step: 4,
    title: "Club Activation",
    description: "Final approval and official club recognition",
    details: [
      "Official club registration",
      "Grant funds disbursement",
      "Club directory listing",
      "Tournament participation eligibility"
    ],
  },
];

const grantBenefits = [
  {
    icon: Award,
    title: "Equipment Grants",
    description: "Funding for tables, nets, balls, and training equipment",
  },
  {
    icon: Users,
    title: "Program Development",
    description: "Support for youth programs and community initiatives",
  },
  {
    icon: Calendar,
    title: "Tournament Support",
    description: "Funding for hosting local tournaments and events",
  },
  {
    icon: FileText,
    title: "Marketing & Promotion",
    description: "Support for club promotion and community outreach",
  },
];

const eligibilityCriteria = [
  "Minimum of 15 active members",
  "Safe facility that meets provincial standards",
  "Commitment to inclusive and accessible programs",
  "Willingness to participate in provincial events",
];

const clubTypes = [
  {
    icon: Users,
    title: "Community Club",
    description: "Community-based clubs serving local players of all ages and skill levels. Eligible for MAP funding and provincial programs.",
  },
  {
    icon: Building2,
    title: "School/Institutional Club",
    description: "Clubs operated by schools or institutions. Eligible for MAP funding and equipment support tied to school programs.",
  },
];

export default function ClubRegistration() {

  return (
    <div className="min-h-screen">
      {/* SEO Metadata */}
      <head>
        <title>Register Your Table Tennis Club | Table Tennis Saskatchewan</title>
        <meta name="description" content="Register your club in Saskatchewan to access MAP grants, official recognition, and exclusive resources. Simple 4-step process with support." />
        <link rel="canonical" href="https://www.ttsask.ca/clubs/register" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Register Your Table Tennis Club | Table Tennis Saskatchewan" />
        <meta property="og:description" content="Join Saskatchewan's table tennis community as an official club. Get MAP grants, recognition, and resources." />
        <meta property="og:url" content="https://www.ttsask.ca/clubs/register" />
        <meta property="og:image" content="https://www.ttsask.ca/og/club-register.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register Your Table Tennis Club | Table Tennis Saskatchewan" />
        <meta name="twitter:description" content="Apply in 4 steps. Become an official club and access MAP grant funding and resources." />
        <meta name="twitter:image" content="https://www.ttsask.ca/og/club-register.jpg" />
      </head>

      <Navigation />

      {/* Hero Section - Fixed for no cropping */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Club Journey
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
            >
              Register Your Club
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-xl text-muted-foreground leading-normal mb-8"
            >
              Join Saskatchewan's table tennis community as an official club.
              Get approved for MAP grants and access exclusive resources and support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  size="xl"
                  className="group"
                  onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                  aria-label="Start the club registration process"
                >
                  Start Registration
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => window.location.assign('/contact')}
                  aria-label="Contact our team for registration assistance"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-sm text-muted-foreground mt-6"
            >
              Online form • 10–12 minutes • Save & resume later
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* What is MAP? Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center mb-6"
            >
              <DollarSign className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-4xl font-bold">What is MAP Funding?</h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              MAP (Membership Assistance Program) funding is provided by Table Tennis Saskatchewan through support from Sask Sport and Sask Lotteries.
              It helps promote the growth of table tennis across the province by funding equipment, development, and community initiatives.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Club Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Target className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-6">Club Types</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {clubTypes.map((club, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Card className="p-8 h-full hover:shadow-medium transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <club.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{club.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{club.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Check className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-6">Eligibility Criteria</h2>
              <p className="text-xl text-muted-foreground">
                Clubs must meet these requirements to be eligible for registration and grants
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibilityCriteria.map((criteria, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full hover:shadow-medium transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{criteria}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Need Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center mb-6"
              >
                <Upload className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">What you'll need</h2>
              </motion.div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Completed application form</p>
                    <p className="text-sm text-muted-foreground">(download from our site or complete online)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Proof of insurance</p>
                    <p className="text-sm text-muted-foreground">(or intent to obtain)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Upload className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Supporting documents</p>
                    <p className="text-sm text-muted-foreground">(attach when submitting online or include with paper form)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  <strong>How to apply:</strong> You can download the paper application from our website or fill the form online and attach documents directly.
                </p>
                <p className="text-sm font-medium">
                  <strong>Accepted files:</strong> PDF, DOCX, PNG, JPG — max 10 MB each
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Grant Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Award className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-6">MAP Grant Benefits</h2>
              <p className="text-xl text-muted-foreground">
                Eligible clubs can receive funding through the MAP program to support their growth and development
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {grantBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-medium transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 mr-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Calendar className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-6">Registration Process</h2>
              <p className="text-xl text-muted-foreground mb-4">
                Four simple steps to become an official Table Tennis Saskatchewan club
              </p>
            </motion.div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Timeline: Most applications reviewed within 5–10 business days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Registration fee: $225. No background check required.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {registrationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="relative mb-12"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-primary-light flex items-center justify-center shadow-medium">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Card className="p-6 hover:shadow-medium transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>

                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-3">
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>

                {index < registrationSteps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-primary to-primary-light opacity-30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* What Happens After You Click Start */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center mb-6"
              >
                <ArrowRight className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">What happens after you click "Start Registration"</h2>
              </motion.div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create/confirm account</p>
                    <p className="text-sm text-muted-foreground">Set up your secure account to save progress and track your application</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Fill application (10–12 minutes)</p>
                    <p className="text-sm text-muted-foreground">Complete the online form with your club details and requirements</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Upload documents</p>
                    <p className="text-sm text-muted-foreground">Securely upload required documents (constitution, bylaws, insurance, etc.)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Review in 5–10 business days (email updates)</p>
                    <p className="text-sm text-muted-foreground">We'll review your application and contact you with the decision</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Application CTA */}
      <section id="application-form" className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-6">Ready to Start Your Club?</h2>
              <p className="text-xl opacity-90 leading-normal mb-8">
                Take the first step towards building a thriving table tennis community in your area.
                Our team is here to guide you through the entire process.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  size="xl"
                  aria-label="Download the club registration application form"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Download Application Form
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => window.location.href = '/contact'}
                  aria-label="Contact our team for registration assistance"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Our Team
                </Button>
              </motion.div>
            </motion.div>

            <p className="text-sm opacity-75 mt-6 mb-6">
              We use your info only to process your application. See our Privacy Policy for details.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href="tel:3061234567" className="hover:underline">(306) 123-4567</a>
                </div>
                <p className="text-sm opacity-75">Mon-Fri 9am-5pm CST</p>
                <p className="text-sm opacity-75">We reply within 2 business days</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href="mailto:clubs@ttsask.ca" className="hover:underline">clubs@ttsask.ca</a>
                </div>
                <p className="text-sm opacity-75">Email support available</p>
                <p className="text-sm opacity-75">24/7 application status</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <p className="text-sm opacity-75">SSL encrypted</p>
                <p className="text-sm opacity-75">GDPR compliant</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-4">Related Policies & Resources</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="/policies/safe-sport" className="hover:underline">Safe Sport Policy</a>
                <span className="text-white/40">|</span>
                <a href="/policies/code-of-conduct" className="hover:underline">Code of Conduct</a>
                <span className="text-white/40">|</span>
                <a href="/policies/concussion" className="hover:underline">Concussion Protocol</a>
                <span className="text-white/40">|</span>
                <a href="/policies/photo-consent" className="hover:underline">Photo Consent</a>
                <span className="text-white/40">|</span>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-8 text-muted-foreground">Trusted by clubs across Saskatchewan</h3>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <blockquote className="text-muted-foreground italic mb-4">
                  "The registration process was straightforward and our grant application was approved quickly. We've been able to expand our youth program significantly."
                </blockquote>
                <div className="text-sm font-medium">
                  — Regina Table Tennis Club
                </div>
              </Card>

              <Card className="p-6">
                <blockquote className="text-muted-foreground italic mb-4">
                  "Excellent support from the TTSASK team. The MAP grant has allowed us to purchase new equipment and host regional tournaments."
                </blockquote>
                <div className="text-sm font-medium">
                  — Saskatoon Ping Pong Association
                </div>
              </Card>

              <Card className="p-6">
                <blockquote className="text-muted-foreground italic mb-4">
                  "The templates and guidance provided made the entire process much easier. We're now officially recognized and have access to provincial events."
                </blockquote>
                <div className="text-sm font-medium">
                  — Prince Albert Table Tennis
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
